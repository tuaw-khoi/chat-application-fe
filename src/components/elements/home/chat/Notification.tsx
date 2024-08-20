import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useRoom from "@/hooks/useRoom";

const Notification = () => {
  const userId = "1b1936f6-8477-4887-ad96-f57396e159cb";
  const { useRoomsForUser } = useRoom();
  const { data, error, isLoading } = useRoomsForUser(userId);
  // console.log(data);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading rooms</div>;

  return (
    <div className="w-1/5">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          {/* <CommandEmpty>No results found.</CommandEmpty> */}
          <CommandGroup heading="Room Chat">
            {data && data.length > 0 ? (
              data.map((room: any) => (
                <CommandItem key={room.roomId}>
                  <div key={room.roomId} className="p-2 border-b">
                    {room.latestMessage}
                  </div>
                </CommandItem>
              ))
            ) : (
              <div>No rooms found.</div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Notification;
