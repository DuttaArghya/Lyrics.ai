import { useState } from "react";
import Head from "next/head";
import { Snackbar } from '@mui/material';


const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [legend, setLegend] = useState("");

  //API Call
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const CopyToClipboardButton = () => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
      setOpen(true);
      navigator.clipboard.writeText(apiOutput);
    }

    return (
      <>
        <button onClick={handleClick}>Copy</button>
        <Snackbar
          open={open}
          onClose={() => setOpen(false)}
          autoHideDuration={2000}
          message="Copied to Clipboard"
        />
      </>
    )
  }

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ legend, userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied....", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const onUserChangeText = (event) => {
    if (event.target.name === "legend") {
      setLegend(event.target.value);
    } else {
      setUserInput(event.target.value);
    }
  };

  return (
    <div className="root">
      <Head>
        <title>Lyrics.ai - Legends never die</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Lyrics.ai</h1>
          </div>
          <div className="header-subtitle">
            <h2>Legends never die.</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            name="legend"
            placeholder="John Lennon"
            className="legend-box"
            value={legend}
            onChange={onUserChangeText}
          />
          <textarea
            placeholder="Anything you want the song to be about..."
            className="prompt-box"
            value={userInput}
            onChange={onUserChangeText}
          />

          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
          {/* Output */}
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
              <CopyToClipboardButton />
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://twitter.com/Arghyad18"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <p>build by Arghya</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
