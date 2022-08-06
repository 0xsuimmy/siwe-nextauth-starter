import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useConnect, useSignMessage } from "wagmi";

const Header = () => {
  const { connectAsync, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  console.log(session);
  console.log(status);
  const handleLogin = async () => {
    try {
      const res = await connectAsync({ connector: connectors[0] });
      const callbackUrl = "/protected";
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.account,
        statement: "Sign in with Ethereum",
        uri: window.location.origin,
        version: "1",
        chainId: res.chain.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({ message: message.prepareMessage() });
      signIn("credentials", { message: JSON.stringify(message), redirect: false, signature, callbackUrl });
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "end" }}>
      {!session && (
        <button style={{ backgroundColor: "gray", padding: "12px" }} onClick={handleLogin}>
          Connect
        </button>
      )}
      {session?.user && (
        <button
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          {session.user.name?.substring(0, 5)}...{session.user.name?.substring(session.user.name.length - 2, session.user.name.length)}
        </button>
      )}
    </div>
  );
};

export default Header;
