import "./globals.css";
import Navbar from '@/components/navbar';

import { Provider } from "./provider"


export const metadata = {
  title: "Snapdle",
  description: "Daily -dle style game for Marvel Snap",
};

export default function RootLayout({ children }) {

  return (
      <html lang="en" suppressHydrationWarning>
        <body className="w-full flex flex-col items-center justify-start" >
          <Provider>
            <div className="min-w-[375px] w-1/2" >
              <Navbar/>
              <div>{children}</div>
            </div>
          </Provider>
          
        </body>
      </html>
    
  );
}
