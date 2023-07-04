import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { buttonVariants } from "~/components/button";
import { api } from "~/utils/api";

const WIDTH = 900;
const HEIGHT = 300;

export default function Home() {
  const uploadImageMutation = api.example.uploadImage.useMutation({
    // onSuccess: () => clearPad(),
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad>();
  // const [imageURL, setImageUrl] = useState<string | undefined>(undefined);
  const [text, setText] = useState("");

  const undoPad = () => {
    if (!padRef.current) throw Error("UNDO: no pad ref!");
    const data = padRef.current.toData();
    data.pop();
    padRef.current.fromData(data);
  };

  const clearPad = () => {
    if (!padRef.current) throw Error("CLEAR: no pad ref!");
    padRef.current.clear();
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) throw Error("Could not get context");

    const pad = new SignaturePad(canvas, {
      minWidth: 5,
      maxWidth: 10,
    });
    padRef.current = pad;
  }, []);

  return (
    <>
      <Head>
        <title>OCR - vision</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="m-4">
        <div>
          <p>Text: {text}</p>
          <input
            className="rounded-lg border-2 border-black p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <select></select>
        </div>

        <div className="my-8" />

        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="rounded-lg border-2 border-black"
        />
        <div className="my-8" />

        <div>
          <button className={buttonVariants()} onClick={clearPad}>
            Clear
          </button>

          <button className={buttonVariants()} onClick={undoPad}>
            Undo
          </button>
          <button
            className={buttonVariants()}
            onClick={() => {
              if (!canvasRef.current) throw Error("SUBMIT: no canvas ref!");
              if (!padRef.current) throw Error("SUBMIT: no pad ref!");
              if (padRef.current.isEmpty()) {
                console.log("SUBMIT: pad is empty");
                return;
              }

              const dataURL = padRef.current.toDataURL();
              uploadImageMutation.mutate({ base64: dataURL });
              // setImageUrl(dataURL);
            }}
          >
            Submit
          </button>
        </div>
        <div className="my-8" />
        <div>
          <div>
            <span>Mutation results</span>
            <button
              className={buttonVariants()}
              onClick={() => {
                uploadImageMutation.reset();
                // setImageUrl(undefined);
              }}
            >
              Reset
            </button>
          </div>
          {uploadImageMutation.isError && (
            <p className="text-red-500">{uploadImageMutation.error.message}</p>
          )}
          {uploadImageMutation.isLoading && (
            <p className="text-amber-500">LOADING....</p>
          )}
          {uploadImageMutation.isSuccess && (
            <p className="text-green-500">Great Success!</p>
          )}
        </div>
        {/* <div>{imageURL && <img src={imageURL} alt="my image" />}</div> */}
        {uploadImageMutation.data && (
          <pre>{JSON.stringify(uploadImageMutation.data, null, 2)}</pre>
        )}
      </main>
    </>
  );
}
