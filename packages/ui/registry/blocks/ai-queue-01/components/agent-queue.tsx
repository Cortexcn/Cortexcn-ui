"use client";

import type { QueueMessage, QueueTodo } from "@/components/queue";
import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemAttachment,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemImage,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@/components/queue";
import { ListTodoIcon, MessageSquareIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

const SAMPLE_MESSAGES: QueueMessage[] = [
  {
    id: "m1",
    parts: [{ type: "text", text: "Add a pricing table to the landing page" }],
  },
  {
    id: "m2",
    parts: [
      { type: "text", text: "Match the hero to these brand colors" },
      {
        type: "file",
        // Sample photo from Unsplash (free to use under the Unsplash License).
        url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=64&q=80",
        mediaType: "image/jpeg",
        filename: "palette.jpg",
      },
      {
        type: "file",
        url: "#",
        mediaType: "application/pdf",
        filename: "brand-guide.pdf",
      },
    ],
  },
  {
    id: "m3",
    parts: [{ type: "text", text: "Then write the FAQ from support tickets" }],
  },
];

const SAMPLE_TODOS: QueueTodo[] = [
  {
    id: "t1",
    title: "Read the landing page",
    status: "completed",
  },
  {
    id: "t2",
    title: "Install the pricing block",
    description: "Three plans, with the middle one highlighted",
    status: "completed",
  },
  {
    id: "t3",
    title: "Fill in the three plans",
    description: "Starter, Team, and Enterprise",
    status: "pending",
  },
  {
    id: "t4",
    title: "Check it in light and dark mode",
    status: "pending",
  },
];

export interface AgentQueueProps {
  messages?: QueueMessage[];
  todos?: QueueTodo[];
  className?: string;
}

function messageText(message: QueueMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");
}

/**
 * What an agent has lined up: the messages waiting their turn, with their
 * attachments and a way to drop one, above the run's todo list.
 */
export function AgentQueue({
  messages: initialMessages = SAMPLE_MESSAGES,
  todos = SAMPLE_TODOS,
  className,
}: AgentQueueProps) {
  const [messages, setMessages] = useState(initialMessages);

  return (
    <Queue className={className}>
      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel
            count={messages.length}
            icon={<MessageSquareIcon className="size-4" />}
            label={messages.length === 1 ? "queued message" : "queued messages"}
          />
        </QueueSectionTrigger>
        <QueueSectionContent>
          <QueueList>
            {messages.map((message) => {
              const files = message.parts.filter(
                (part) => part.type === "file",
              );
              return (
                <QueueItem key={message.id}>
                  <div className="flex items-center gap-2">
                    <QueueItemIndicator />
                    <QueueItemContent>{messageText(message)}</QueueItemContent>
                    <QueueItemActions>
                      <QueueItemAction
                        aria-label="Remove from the queue"
                        onClick={() =>
                          setMessages((current) =>
                            current.filter((item) => item.id !== message.id),
                          )
                        }
                      >
                        <Trash2Icon className="size-3" />
                      </QueueItemAction>
                    </QueueItemActions>
                  </div>
                  {files.length > 0 ? (
                    <QueueItemAttachment className="ml-4.5">
                      {files.map((file) =>
                        file.mediaType?.startsWith("image/") ? (
                          <QueueItemImage
                            alt={file.filename}
                            key={file.filename}
                            src={file.url}
                          />
                        ) : (
                          <QueueItemFile key={file.filename}>
                            {file.filename}
                          </QueueItemFile>
                        ),
                      )}
                    </QueueItemAttachment>
                  ) : null}
                </QueueItem>
              );
            })}
          </QueueList>
        </QueueSectionContent>
      </QueueSection>

      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel
            count={todos.length}
            icon={<ListTodoIcon className="size-4" />}
            label="todos"
          />
        </QueueSectionTrigger>
        <QueueSectionContent>
          <QueueList>
            {todos.map((todo) => {
              const completed = todo.status === "completed";
              return (
                <QueueItem key={todo.id}>
                  <div className="flex items-center gap-2">
                    <QueueItemIndicator completed={completed} />
                    <QueueItemContent completed={completed}>
                      {todo.title}
                    </QueueItemContent>
                  </div>
                  {todo.description ? (
                    <QueueItemDescription completed={completed}>
                      {todo.description}
                    </QueueItemDescription>
                  ) : null}
                </QueueItem>
              );
            })}
          </QueueList>
        </QueueSectionContent>
      </QueueSection>
    </Queue>
  );
}
