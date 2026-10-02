import type { Metadata } from 'next';
import './globals.css';
import { KitchenProvider } from '@/components/miwas-kitchen/kitchen-provider';
export const metadata: Metadata = { metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000'), title:{default:"Miwa's Kitchen | Homemade food, made with care",template:"%s | Miwa's Kitchen"}, description:'Warm, generous homemade food from Miwa’s Kitchen.', openGraph:{title:"Miwa's Kitchen",description:'Homemade food, made with care.',type:'website'}, icons:{icon:'/icon.svg'}, manifest:'/manifest.webmanifest', themeColor:'#481d38' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><KitchenProvider>{children}</KitchenProvider></body></html> }
