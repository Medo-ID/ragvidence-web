import { CopyCommand } from "./copy-command";

type Props = { content: string; label?: string; prompt?: boolean; wrap?: boolean; className?: string };

export function CodeBlock({ content, label = "Terminal", prompt = false, wrap = false, className = "" }: Props) {
  return (
    <div className={`terminal ${className}`}>
      <div className="terminal-header">
        <span className="font-mono text-xs text-muted">{label}</span>
        <CopyCommand command={content} contentLabel={label === "Terminal" || label === "bash" ? "command" : label} />
      </div>
      <pre tabIndex={wrap ? undefined : 0} aria-label={`${label} content`} className={wrap ? "terminal-content whitespace-pre-wrap break-words" : "terminal-content whitespace-pre"}><code>{prompt && <span aria-hidden="true" className="select-none text-signal-ink">$ </span>}{content}</code></pre>
    </div>
  );
}
