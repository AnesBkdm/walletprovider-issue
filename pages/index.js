import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

import { createAppKit, useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { BrowserProvider } from "ethers";

const inter = Inter({ subsets: ["latin"] });

// 1. Get projectId
const projectId = 'd055e7857bc72a66e202ac73241cb409';

// 2. Set the networks
const networks = [arbitrum, mainnet];

// 3. Create a metadata object - optional
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export default function Home() {
  const [ web3status, setWeb3status ] = useState("init");
  const [ flag, setFlag ] = useState(false);

  const { open } = useAppKit();
  const { address, status } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider();

  function handleOpen() {
    setFlag(true);
    open();
  }

  async function signMessage() {
    setWeb3status("sign");

    console.log(walletProvider) // WALLETPROVIDER IS UNDEFINED

    const provider = new BrowserProvider(walletProvider)
    const signer = await provider.getSigner()
    const signature = await signer?.signMessage('Hello AppKit Ethers')
    console.log(signature);

    setWeb3status("done");
  }

  useEffect(()=>{
    if(address && flag) signMessage();
  },[address]);

  return (
    <div className="flex bg-sky-600 items-center w-full h-screen justify-center">
      <button 
        className="bg-white text-black rounded-full px-8 py-2 font-semibold"
        onClick={handleOpen}
        >
        {web3status === "sign" &&
          "Signing message"
        }

        {web3status === "done" &&
          "Done"
        }

        {web3status === "init" &&
          "Connect"
        }
      </button>
    </div>
  );
}
