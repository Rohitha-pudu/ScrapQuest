"use client";

import { useState } from "react";
import Snackbar from "./Snackbar";

export default function Form() {
  const [url, seturl] = useState<string>("");
  const [load, setload] = useState(false);
  const [err, seterr] = useState<any>(null);
  const update = (e: any) => {
    seturl(e.target.value);
  };

  const send = async () => {
    setload(true);
    if (err) {
      setload(false);
      return;
    }

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_APP || "http://localhost:3000/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      console.log("Request sent successfully!");
      const data = await response.json();
      if (data.extractedText) {
        const blob = new Blob([data.extractedText], { type: "text/plain" });
        const url2 = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url2;
        a.download = "data.txt";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url2);
      } else {
        if (data.urlerror) {
          seterr(data.urlerror);
        } else {
          seterr("URL cannot be loaded");
        }

        setTimeout(() => {
          seterr(null);
        }, 3000);
      }
      setload(false);
    } catch (error: any) {
      console.error("Error:", error.message);
      seterr("Vercel timeout error. Please setup project locally");
      setTimeout(() => {
        seterr(null);
      }, 3000);
      setload(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-white dark:text-white">
          Type a website url
        </label>
        <input
          onChange={update}
          type="text"
          id="success"
          className="bg-green-50 border border-blue-500 text-blue-900 dark:text-blue-400 placeholder-black-700 dark:placeholder-black-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-blue-500 mb-5"
          placeholder="https://www.example.com"
        />

        <button
          onClick={send}
          type="button"
          className="block text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto"
        >
          {load ? "Downloading..." : "Download now"}
        </button>

        {err && <Snackbar state={err} setstate={seterr} />}
      </div>
    </>
  );
}
