import Button from "@mui/material/Button/Button";
import TextField from "@mui/material/TextField/TextField";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useEffect } from "react";
import { addMessage, getMessages, getNickname } from "../common/api";
import ChatFromOthers from "./ChatFromOthers";
import ChatFromSelf from "./ChatFromSelf";
import SendIcon from "@mui/icons-material/Send";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import { LoadingButton } from "@mui/lab";

interface Props {
  contract: ethers.Contract | undefined;
  userAddress: string;
}

const Chat: React.FC<Props> = ({ contract, userAddress }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [addMessageInput, setAddMessageInput] = useState("");
  const [addMessageLoading, setAddMessageLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleAddMessageForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddMessageLoading(true);
    if (contract) {
      const tx = await addMessage(contract, addMessageInput);
      if (tx) {
        setShowSnackbar(true);
        setAddMessageLoading(false);
        setAddMessageInput("");
      } else {
        setAddMessageLoading(false);
      }
    }
  };

  // get messages from contract
  useEffect(() => {
    if (contract) {
      (async () => {
        const rawMessages = await getMessages(contract);
        if (rawMessages.length > 0) {
          //For each "raw" message, get the nickname if it exists
          const cleanMessages = rawMessages.map((msg: any) => {
            return {
              msgId: msg[0],
              author: msg[2],
              authorAddress: msg[2],
              text: msg[1],
              date: msg[3],
            };
          });

          await Promise.all(
            cleanMessages.map(async (msg: any, index: number) => {
              const nickname = await getNickname(contract, msg.author);
              if (nickname) {
                cleanMessages[index].author = nickname;
              }
            })
          );

          if (cleanMessages.length > 0) {
            setMessages(
              cleanMessages.filter(
                (each: any) =>
                  each.authorAddress !==
                  "0x0000000000000000000000000000000000000000"
              )
            );
          }
        }
      })();
    }
  }, [contract]);

  return (
    <div className="absolute right-0 h-screen bg-gradient-to-b from-slate-200 to-slate-300 w-1/2 sm:w-1/2 md:w-2/3 lg:w-2/3 xl:w-2/3">
      {/* Popup for when a message is succesfully sent */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={10000}
        onClose={() => setShowSnackbar(false)}
        open={showSnackbar}
        message="Message sent. Please wait for the TX to be mined."
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "green",
          },
        }}
      />
      <div className="w-100 m-4 h-[calc(100%-170px)] overflow-y-auto">
        {messages.length > 0 &&
          messages.map((each) => {
            if (each.authorAddress === userAddress) {
              return (
                <ChatFromSelf
                  key={each.msgId}
                  msgId={each.msgId}
                  author={each.author}
                  text={each.text}
                  date={each.date.toString()}
                />
              );
            } else {
              return (
                <ChatFromOthers
                  key={each.msgId}
                  msgId={each.msgId}
                  author={each.author}
                  text={each.text}
                  date={each.date.toString()}
                />
              );
            }
          })}
      </div>
      {/* Form to send new message */}
      <form
        className="fixed bottom-0 flex w-[inherit]"
        onSubmit={handleAddMessageForm}
      >
        <div className="p-4 w-[calc(100%-50px)]">
          <TextField
            id="filled-multiline-static"
            label="Enter a Message"
            multiline
            rows={4}
            variant="filled"
            fullWidth
            disabled={addMessageLoading}
            value={addMessageInput}
            onChange={(e) => setAddMessageInput(e.target.value)}
          />
        </div>
        <div className="h-fit m-auto mr-4">
          <LoadingButton
            variant="contained"
            endIcon={<SendIcon />}
            type="submit"
            disabled={!addMessageInput}
            loading={addMessageLoading}
          >
            Send
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default Chat;
