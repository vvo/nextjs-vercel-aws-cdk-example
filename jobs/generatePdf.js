export async function generatePdf(event) {
  const { words } = JSON.parse(event.Records[0].Sns.Message);

  console.log(
    `Here we check twitter for the words ${words}, generate a PDF and send it via email`
  );

  return true;
}
