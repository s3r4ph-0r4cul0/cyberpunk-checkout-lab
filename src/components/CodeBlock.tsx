import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({ 
  code, 
  language = "python", 
  filename,
  showLineNumbers = true 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative group rounded-sm overflow-hidden border border-primary/30 bg-background">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-primary/30 bg-muted/30">
          <span className="font-mono text-xs text-muted-foreground">{filename}</span>
          <span className="font-mono text-xs text-primary/60">{language}</span>
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="font-mono">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-muted-foreground/50 w-8 text-right pr-4">
                    {i + 1}
                  </span>
                )}
                <span className="text-foreground/90">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
