"use client";
import { useUserJoinStore } from "@/hooks/useUserJoin";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Socket, io } from "socket.io-client";
import { LuMousePointer2 } from "react-icons/lu";

interface User {
  id: string;
  mouseX: number;
  mouseY: number;
}

export default function Home() {
  const [socket, setSocket] = useState<Socket>();
  const name = useUserJoinStore((state) => state.name);
  const [users, setUsers] = useState<User[]>([]);

  async function socketInit() {
    const socket = io("http://localhost:3030");
    setSocket(socket);
  }

  useEffect(() => {
    socketInit();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit(
        "user-join",
        JSON.stringify({ id: name, mouseX: 0, mouseY: 0 } as User)
      );

      socket.on("user-join", (ev) => {
        const { id, mouseX, mouseY } = JSON.parse(ev);
        const i = users.findIndex((v) => v.id === id);

        setUsers((prev) => [...prev, { id, mouseX, mouseY }]);
      });

      socket.on("user-move", (ev) => {
        const { id, mouseX, mouseY } = JSON.parse(ev);

        setUsers((prev) => {
          const temp = [...prev];
          const i = temp.findIndex((e) => {
            return e.id === id;
          });
          console.log(i);
          if (i >= 0) {
            temp[i].mouseX = mouseX;
            temp[i].mouseY = mouseY;
          }
          return temp;
        });
      });

      socket.on("user-left", (ev) => {
        const { id, mouseX, mouseY } = JSON.parse(ev);

        setUsers((prev) => {
          const temp = [...prev];
          const i = temp.findIndex((e) => {
            return e.id === id;
          });
          console.log(i);
          if (i >= 0) {
            temp.splice(i, 1);
          }
          return temp;
        });
      });

      document.addEventListener("mousemove", (ev) => {
        socket.emit(
          "user-move",
          JSON.stringify({
            id: name,
            mouseX: ev.clientX,
            mouseY: ev.clientY,
          } as User)
        );
      });

      window.addEventListener("beforeunload", (ev) => {
        socket.emit(
          "user-left",
          JSON.stringify({ id: name, mouseX: 0, mouseY: 0 } as User)
        );
      });
    }
  }, [socket]);

  useEffect(() => {
    async function getUsers() {
      const data = await fetch("http://localhost:3030");
      const list = await data.json();
      setUsers(list);
    }
    getUsers();
  }, []);
  return (
    <main>
      {users.map((v, i) => {
        return (
          <div
            key={i}
            style={{ left: v.mouseX, top: v.mouseY }}
            className="absolute flex items-center gap-1"
          >
            <LuMousePointer2 />
            <div className="py-1 px-2 bg-indigo-600 rounded-full text-[12px] flex items-center justify-center text-white">
              {v.id}
            </div>
          </div>
        );
      })}
    </main>
  );
}
