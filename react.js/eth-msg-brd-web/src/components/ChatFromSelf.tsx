import { format, fromUnixTime } from "date-fns";

interface Props {
  msgId: string;
  author: string;
  text: string;
  date: string;
}

const ChatFromSelf: React.FC<Props> = ({ msgId, author, text, date }) => {
  const formattedDate = format(fromUnixTime(Number(date)), "MMM dd, yyy HH:mm");

  return (
    <div className="w-2/3 mb-4 p-2 rounded-lg rounded-br-none m-auto mr-0 bg-emerald-600">
      <div className="flex">
        <div className="text-xs text-slate-200">{author}</div>
        <div className="text-xs text-slate-200 m-auto mr-0">
          {formattedDate}
        </div>
      </div>
      <div className="text-slate-100 text-md">{text}</div>
    </div>
  );
};

export default ChatFromSelf;
