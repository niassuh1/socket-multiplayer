"use client";

import { useUserJoinStore } from "@/hooks/useUserJoin";
import { useRouter } from "next/navigation";

export default function JoinRoomPage() {
  const updateName = useUserJoinStore((state) => state.updateName);
  const name = useUserJoinStore((state) => state.name);
  const router = useRouter();

  return (
    <main className="w-full h-screen flex items-center">
      <div className="flex flex-col gap-3 w-full max-w-sm mx-auto bg-white border border-black/20 rounded-md p-3">
        <div>Enter your name to enter the room</div>
        <div className="flex gap-3">
          <input
            placeholder="Name here"
            onChange={(e) => updateName(e.target.value)}
            className="px-2 py-1 border border-black/20 rounded-md w-full"
          />
          <button
            onClick={() => {
              router.push("/");
            }}
            disabled={!name}
            className="bg-black py-2 px-4 rounded-md text-white disabled:bg-black/40"
          >
            Join
          </button>
        </div>
      </div>
    </main>
  );
}
