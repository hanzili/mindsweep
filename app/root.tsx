import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>
          {`
            body {
              background-color: #0a0b12;
              color: #e0e0e0;
              font-family: 'Inter', sans-serif;
              overflow-x: hidden;
              margin: 0;
              padding: 0;
              line-height: 1.5;
            }
            
            .glass {
              background: rgba(30, 32, 45, 0.85);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(159, 122, 234, 0.25);
              border-radius: 14px;
              box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
              transition: all 0.3s ease;
            }
            
            .glass:hover {
              background: rgba(35, 37, 55, 0.9);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
              border-color: rgba(129, 140, 248, 0.4);
            }
            
            .glass-nav {
              background: rgba(18, 19, 28, 0.95);
              backdrop-filter: blur(12px);
              border-bottom: 1px solid rgba(139, 92, 246, 0.25);
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            
            .page-mockup {
              width: 100%;
              height: 100vh;
              margin: 0;
              position: relative;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              overflow: hidden;
            }
            
            .bg-texture {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url('/images/texture-bg.jpg');
              background-size: cover;
              opacity: 0.15;
              z-index: -1;
              animation: subtle-move 120s infinite alternate ease-in-out;
            }
            
            @keyframes subtle-move {
              0% {
                transform: scale(1.0) translate(0, 0);
              }
              100% {
                transform: scale(1.05) translate(-1%, -1%);
              }
            }
            
            .no-scrollbar {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            
            .btn-primary {
              background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4), 0 0 0 rgba(126, 34, 206, 0);
            }
            
            .btn-primary:hover {
              opacity: 0.95;
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(79, 70, 229, 0.5), 0 0 0 2px rgba(126, 34, 206, 0.15);
            }
            
            a, button {
              transition: all 0.2s ease;
            }
            
            a:hover, button:hover {
              transform: translateY(-1px);
            }
            
            /* Add subtle pulse animation to the main button */
            @keyframes subtle-pulse {
              0% {
                box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
              }
              50% {
                box-shadow: 0 4px 25px rgba(79, 70, 229, 0.6);
              }
              100% {
                box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
              }
            }
            
            .btn-primary {
              animation: subtle-pulse 3s infinite ease-in-out;
            }
            
            /* Add background grid pattern */
            .bg-grid {
              background-size: 30px 30px;
              background-image: 
                linear-gradient(to right, rgba(87, 89, 134, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(87, 89, 134, 0.05) 1px, transparent 1px);
              background-position: top center;
            }
            
            /* Improved gradient text for better visibility */
            .gradient-text {
              background: linear-gradient(to right, #a5b4fc, #c4b5fd, #e9d5ff);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              text-shadow: 0 1px 3px rgba(255, 255, 255, 0.2), 0 0 8px rgba(167, 139, 250, 0.3);
              font-weight: bold;
              letter-spacing: 0.015em;
            }
          `}
        </style>
      </head>
      <body className="bg-grid">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
