import { Shield, Skull, Terminal } from "lucide-react";

export const Header = () => {
  return (
    <header className="relative border-b border-primary/30 bg-background/80 backdrop-blur-sm">
      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line opacity-50" />
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Shield className="w-10 h-10 text-primary animate-pulse-neon" />
              <Skull className="w-5 h-5 text-destructive absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-black tracking-wider">
                <span className="neon-text-green">SECURITY</span>
                <span className="text-destructive">_</span>
                <span className="neon-text-red">LAB</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono tracking-widest">
                BUSINESS LOGIC ABUSE // MANIPULAÇÃO DE PREÇO
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-sm border border-primary/30 bg-primary/5">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm text-muted-foreground">
              OWASP API6:2023
            </span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
};
