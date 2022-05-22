import { ethers } from "ethers";

// Read
export const getMessages = async (contract: ethers.Contract) => {
  const messages = await contract.getMessages();
  return messages;
};

export const getNickname = async (
  contract: ethers.Contract,
  address: string
) => {
  const nickname = await contract.addressToNickname(address);
  return nickname;
};

//Write
export const updateNickname = async (
  contract: ethers.Contract,
  nickname: string
) => {
  try {
    const tx = await contract.updateNickname(nickname);
    return tx;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const addMessage = async (
  contract: ethers.Contract,
  message: string
) => {
  try {
    const tx = await contract.addMessage(message);
    return tx;
  } catch (err) {
    console.log(err);
    return false;
  }
};
