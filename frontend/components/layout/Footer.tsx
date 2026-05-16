import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full justify-center px-4 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Bank App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
