"use client";

import { useRouter } from 'next/navigation';
import { IoClose as CloseIcon } from "react-icons/io5";


export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="p-4">
      <div className='flex flex-row justify-between mb-6'>
        <h1 className="text-2xl">How to Play</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-red-500 px-1 rounded"
        >
          <CloseIcon className='w-6 h-6 text-white'/>
        </button>
      </div>
      
      <div className='ml-8'>
        <ol className='list-decimal flex flex-col gap-4'>
          <li>
            Try to guess the Marvel Snap card in <em className='text-purple-500 not-italic font-bold'>8</em> guesses.
          </li>
          <li>
            <em className='text-green-500 not-italic font-bold'>Green</em> is an exact match.
          </li>
          <li>
            [Easy mode only] <em className='text-yellow-500 not-italic font-bold'>Yellow</em> is a close match.
          </li>
          <ul className='list-disc ml-2 flex flex-col gap-2'>
            <li>
              A yellow <em className='text-purple-500 font-bold'>Name</em> means the correct card starts with the same letter as the guessed card. 
            </li>
            <li>
              A yellow <em className='text-purple-500 font-bold'>Cost</em> / <em className='text-purple-500 font-bold'>Power</em> / other quantitative column means that value is within one of the correct card&apos;s value.
            </li>
            
          </ul>
          <li>
            On the 7th guess, you get the option to show the card&apos;s <em className='text-purple-500 font-bold'>Ability Text</em> as a hint.
          </li>
          
          <li>
            Column explanations:
          </li>
          <ul className='list-disc ml-2 flex flex-col gap-2'>
            <li>
              <em className='text-purple-500 font-bold'>Series</em> refers to the current series/pool the card is in (0-5). 
              <ul className='list-disc ml-4 flex flex-col gap-2'>
                <li>Cards listed under the Starter or Recruit series&apos; are considered to be series 0.</li>
                <li>The season pass card is considered to be series 5.</li>
              </ul>
            </li>
            <li>
              <em className='text-purple-500 font-bold'>Ability Type</em> can be on of four option: Ongoing, On Reveal, Other, or None. Some cards (e.g. Blob) are listed as multiple, but will still show as an exact match for either of their ability types.
            </li>
            <li>
              <em className='text-purple-500 font-bold'>Release Month</em> and <em className='text-purple-500 font-bold'>Release Year</em> refer to the date the card was released.
            </li>
          </ul>
          
        </ol>
      </div>

      <p className='mt-8 font-medium'>
        All card data comes (indirectly) from snap.fan
      </p>
      <p className='mt-2 font-medium'>
        All data is up to date as of <em className='text-red-500 not-italic font-bold'>06/24/2024</em>
      </p>
      
    </div>
  );
}
