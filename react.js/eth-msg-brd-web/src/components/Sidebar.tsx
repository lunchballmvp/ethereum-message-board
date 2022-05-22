import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoadingButton from "@mui/lab/LoadingButton";
import InfoIcon from "@mui/icons-material/Info";
import BadgeIcon from "@mui/icons-material/Badge";
import Button from "@mui/material/Button/Button";
import TextField from "@mui/material/TextField/TextField";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { getNickname, updateNickname } from "../common/api";
import Snackbar from "@mui/material/Snackbar/Snackbar";

interface Props {
  contract: ethers.Contract | undefined;
  userAddress: string;
}

const Sidebar: React.FC<Props> = ({ contract, userAddress }) => {
  const [userNickname, setUserNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const disableNicknameInput = !nicknameInput || nicknameLoading;

  //Check if current user has a nickname
  useEffect(() => {
    if (userAddress && contract) {
      (async () => {
        const nickname = await getNickname(contract, userAddress);
        setUserNickname(nickname);
      })();
    }
  }, [userAddress, contract]);

  const handleNicknameForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contract) {
      setNicknameLoading(true);
      const tx = await updateNickname(contract, nicknameInput);
      if (tx) {
        setNicknameLoading(false);
        setShowSnackbar(true);
      } else {
        setNicknameLoading(false);
      }
    }
  };

  return (
    <div className="bg-slate-400 w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 absolute top-0 left-0 h-screen m-0 flex flex-col shadow-lg z-10">
      {/* Popup for succesfull nickname change */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={10000}
        onClose={() => setShowSnackbar(false)}
        open={showSnackbar}
        message="Nickname updated. Please wait for the TX to be mined."
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "green",
          },
        }}
      />
      {/* Address / nickname box */}
      {userAddress && (
        <div className="bg-gray-300 w-fill shadow-sm rounded-md mx-4 mt-4 h-fit">
          {userAddress ? (
            // Case when user has a nickname
            <div className="flex mt-2 ml-4 mb-2">
              <AccountBalanceWalletIcon
                style={{ fill: "rgb(56,63,80)" }}
                fontSize="large"
              />
              <div className="grid space-y-[-0.4em]">
                <span className="text-sm font-semibold text-slate-800 m-auto ml-2">
                  {userNickname}
                </span>
                <span className="ml-2 overflow-hidden whitespace-nowrap text-ellipsis font-semibold text-slate-500 text-xxs">
                  {userAddress}
                </span>
              </div>
            </div>
          ) : (
            // Case when user does not have a nickname. I.e. only show the wallet address
            <div className="flex mt-2 ml-4 mb-2">
              <AccountBalanceWalletIcon
                style={{ fill: "rgb(56,63,80)" }}
                fontSize="large"
              />
              <div className="ml-3 text-xs overflow-x-hidden text-ellipsis font-semibold text-slate-800  grid place-items-center ]">
                {userAddress}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Testnet info box */}
      <div className="bg-gray-300 w-fill shadow-sm rounded-md mx-4 mt-4 h-fit">
        <div className="flex mt-4 ml-4">
          <InfoIcon style={{ fill: "rgb(56,63,80)" }} fontSize="large" />
          <span className="ml-3 text-lg mt-1 font-semibold text-slate-800">
            Important
          </span>
        </div>
        <div className="text-sm mt-4 w-full px-4 mb-4 text-slate-800 text-justify">
          This app uses the Rinkeby testnet. You can get testnet funds from the
          faucet below.
        </div>
        <div className="h-fit float-left ml-4 mb-4 mt-2">
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              window.open("https://rinkebyfaucet.com/", "_blank");
            }}
          >
            GO
          </Button>
        </div>
      </div>

      {/* Nickname Entry Field */}
      <div className="bg-gray-300 w-fill shadow-sm rounded-md mx-4 mt-4 h-fit">
        <div className="flex mt-4 ml-4">
          <BadgeIcon style={{ fill: "rgb(56,63,80)" }} fontSize="large" />
          <span className="ml-3 text-lg mt-1 font-semibold text-slate-800">
            Nickname
          </span>
        </div>
        <div className="text-sm mt-4 w-full px-4 mb-4 text-slate-800 text-justify">
          Choose a nickname to identify yourself in the chat. Otherwise, people
          will only see your public address.
        </div>
        <form onSubmit={handleNicknameForm}>
          <div className="relative left-0 w-fit ml-4 mb-4">
            <TextField
              id="filled-basic"
              label="Nickname"
              variant="filled"
              size="small"
              value={nicknameInput}
              onChange={(e) => {
                setNicknameInput(e.target.value);
              }}
              disabled={nicknameLoading}
            />
          </div>

          <div className="h-fit float-left ml-4 mb-4">
            {nicknameLoading ? (
              <LoadingButton loading variant="outlined" size="small">
                SUBMIT
              </LoadingButton>
            ) : (
              <Button
                variant="outlined"
                size="small"
                type="submit"
                disabled={disableNicknameInput}
              >
                SUBMIT
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
