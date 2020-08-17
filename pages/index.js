import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Next.js + Vercel + AWS example</h1>
      <button
        onClick={() => {
          fetch("/api/publishMessage", {
            method: "POST",
            body: JSON.stringify({
              topic: "generatePdf",
              message: { words: ["aws", "cdk"] },
            }),
            headers: { "content-type": "application/json" },
          });
        }}
      >
        Generate PDF
      </button>
    </>
  );
}
