import { getRoomById } from "@/actions/rooms";
import RoomForm from "@/components/room-form";
import InfoMessage from "@/components/info-message";
import PageTitle from "@/components/page-title";
import React from "react";

interface EditRoomPageProps {
  params: Promise<{ id: string }>;
}

async function EditRoomPage({ params }: EditRoomPageProps) {
  const { id } = await params;
  const room = await getRoomById(Number(id));
  if (!room || !room.success || !room.data) {
    return <InfoMessage message="Room not found" />;
  }
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Edit Room" />

      <RoomForm formType="edit" roomData={room.data} />
    </div>
  );
}

export default EditRoomPage;
