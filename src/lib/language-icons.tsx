import { FileCode, FileText, Terminal } from "lucide-react";

// Maps a fenced-code language to a small leading icon shown in code-block titles.
export function getIconForLanguageExtension(language?: string) {
  switch (language) {
    case "bash":
    case "sh":
    case "shell":
    case "zsh":
      return <Terminal />;
    case "text":
    case "txt":
    case "plaintext":
      return <FileText />;
    default:
      return <FileCode />;
  }
}
