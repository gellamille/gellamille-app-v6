"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { dateTimeHU } from "@/lib/format";

type Notification = {
  id: number;
  title: string;
  body: string | null;
  entity_type: string | null;
  entity_id: string | null;
  read_at: string | null;
  created_at: string;
};

function notificationHref(item: Notification) {
  const id = item.entity_id;
  switch (item.entity_type) {
    case "order":
      return id ? `/internal/orders/${encodeURIComponent(id)}` : "/internal/orders";
    case "partner":
      return "/internal/partners";
    case "product":
      return "/internal/products";
    case "lot":
      return "/internal/production";
    case "material":
    case "recipe":
      return "/internal/materials";
    case "shipping_run":
    case "delivery":
      return "/internal/shipments";
    case "product_recall":
      return "/internal/recalls";
    case "task":
      return "/internal/tasks";
    case "app_user":
      return "/internal/settings";
    default:
      return "/internal";
  }
}

export function InternalNotifications({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const [readIds, setReadIds] = useState(() => new Set(notifications.filter((item) => item.read_at).map((item) => Number(item.id))));
  const unread = useMemo(() => notifications.filter((item) => !readIds.has(Number(item.id))).length, [notifications, readIds]);

  async function openNotification(item: Notification) {
    setReadIds((current) => new Set(current).add(Number(item.id)));
    await fetch(`/api/notifications/${item.id}/read`, { method: "POST" }).catch(() => undefined);
    router.push(notificationHref(item));
    router.refresh();
  }

  return (
    <details className="notification-menu">
      <summary>Értesítések{unread > 0 ? <span className="nav-badge">{unread}</span> : null}</summary>
      <div className="notification-panel">
        {notifications.map((item) => (
          <button
            className={`notification-item ${readIds.has(Number(item.id)) ? "is-read" : "is-unread"}`}
            key={item.id}
            type="button"
            onClick={() => openNotification(item)}
          >
            <strong>{item.title}</strong>
            <span>{item.body ?? ""}</span>
            <small>{dateTimeHU(item.created_at)}</small>
          </button>
        ))}
        {!notifications.length ? <div className="empty-state">Még nincs rendszerértesítés.</div> : null}
      </div>
    </details>
  );
}
