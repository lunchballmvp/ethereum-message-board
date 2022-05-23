import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import ABI from "./ABI.json";
import Overlay from "./components/Overlay";
import Sidebar from "./components/Sidebar";
import { getMessages, getNickname } from "./common/api";
import Chat from "./components/Chat";
import { Web3Provider } from "@ethersproject/providers";

//Hack to make typescript happy
declare var window: any;

const CONTRACT_ADDRESS = "0x9555ed8627088CD3d4Cbc7BbdEF27E6543E71322";

// Function to check if MetaMask is installed
function isMetaMaskInstalled() {
  if (window.ethereum) {
    return Boolean(window.ethereum && window.ethereum.isMetaMask);
  } else {
    return false;
  }
}

// Function to check if MetaMask is connected
async function isMetaMaskConnected() {
  try {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_accounts" });
    return accounts && accounts.length > 0;
  } catch (err) {
    return false;
  }
}

function App() {
  // Hacky way to avoid crash if MetaMask is not installed
  let provider: Web3Provider | undefined;
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } catch (err) {
    provider = undefined;
  }

  const [connected, setConnected] = useState(true);
  const [installed, setInstalled] = useState(true);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState<ethers.Contract>();

  //Initialise function to check if user has connected to / installed metamask
  async function initialise() {
    let isConnected = await isMetaMaskConnected();
    let isInstalled = isMetaMaskInstalled();
    setConnected(isConnected);
    setInstalled(isInstalled);
  }
  initialise();

  //event listener to call initialise when accounts change
  window &&
    window.ethereum &&
    window.ethereum.on("accountsChanged", async () => {
      initialise();
    });

  //prompt user to connect their wallet on first render
  useEffect(() => {
    (async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
        setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, signer));
      }
    })();
  }, []);

  return (
    <div className="flex">
      <Overlay installed={installed} connected={connected} />
      <Sidebar contract={contract} userAddress={userAddress} />
      <Chat contract={contract} userAddress={userAddress} />
    </div>
  );
}

export default App;
