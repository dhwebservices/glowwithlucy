import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Package,
  ReceiptText,
  Search,
  Tag,
  Truck,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { apiRequest, money } from "../../lib/api";

const emptyDiscount = {
  id: null,
  code: "",
  description: "",
  kind: "percent",
  amount: 10,
  minOrder: 0,
  active: true,
  startsAt: "",
  endsAt: "",
  usageLimit: "",
};

const orderStatuses = ["new", "paid", "making", "shipped", "completed", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed", "refunded"];

function formatDate(value) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getOrderPreview(order) {
  return (order.items || []).map((item) => item.product_name).join(", ");
}

export function AdminDashboardPage() {
  const { email, logout } = useAdminAuth();
  const [discounts, setDiscounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [discountForm, setDiscountForm] = useState(emptyDiscount);
  const [saving, setSaving] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  async function loadAll() {
    setLoadError("");
    try {
      const [discountsData, ordersData] = await Promise.all([
        apiRequest("/api/admin/discounts"),
        apiRequest("/api/admin/orders"),
      ]);

      setDiscounts(discountsData.discounts || []);
      setOrders(ordersData.orders || []);
    } catch (error) {
      setLoadError(error.message || "Unable to load dashboard data right now.");
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const stats = useMemo(() => {
    const liveOrders = orders.filter((item) => item.status !== "completed").length;
    const readyToMake = orders.filter((item) =>
      ["new", "paid", "making"].includes(item.status)
    ).length;
    const revenue = orders
      .filter((item) => item.payment_status === "paid")
      .reduce((sum, item) => sum + Number(item.total || 0), 0);

    return [
      {
        label: "Open orders",
        value: liveOrders,
        icon: ReceiptText,
      },
      {
        label: "In production",
        value: readyToMake,
        icon: Package,
      },
      {
        label: "Active promo codes",
        value: discounts.filter((item) => item.active).length,
        icon: Tag,
      },
      {
        label: "Paid revenue",
        value: money(revenue),
        icon: Truck,
      },
    ];
  }, [discounts, orders]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;

      const haystack = [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.shipping_address,
        getOrderPreview(order),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [orders, searchTerm, statusFilter]);

  async function saveDiscount(event) {
    event.preventDefault();
    setSaving("discount");
    setLoadError("");
    try {
      await apiRequest("/api/admin/discounts", {
        method: "POST",
        body: JSON.stringify(discountForm),
      });
      setDiscountForm(emptyDiscount);
      await loadAll();
    } catch (error) {
      setLoadError(error.message || "Could not save promo code.");
    } finally {
      setSaving("");
    }
  }

  function editDiscount(discount) {
    setDiscountForm({
      id: discount.id,
      code: discount.code || "",
      description: discount.description || "",
      kind: discount.kind || "percent",
      amount: discount.amount || 0,
      minOrder: Number(discount.min_order_pence || 0) / 100,
      active: Boolean(discount.active),
      startsAt: discount.starts_at || "",
      endsAt: discount.ends_at || "",
      usageLimit: discount.usage_limit || "",
    });
  }

  async function deleteDiscount(id) {
    await apiRequest("/api/admin/discounts", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (discountForm.id === id) {
      setDiscountForm(emptyDiscount);
    }
    await loadAll();
  }

  async function updateOrder(id, patch) {
    await apiRequest("/api/admin/orders", {
      method: "PATCH",
      body: JSON.stringify({ id, ...patch }),
    });
    await loadAll();
  }

  return (
    <div className="min-h-screen bg-[#F5EEE4] pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm text-[#8A7C69]">Staff dashboard</p>
            <h1 className="mt-3 text-5xl font-serif text-[#2E2922]">
              Glow With Lucy admin
            </h1>
            <p className="mt-3 text-[#6B6358]">Signed in as {email}</p>
          </div>
          <Button className="btn-outline rounded-full px-6" onClick={logout}>
            Sign out
            <LogOut className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <section
                key={stat.label}
                className="rounded-2xl border border-[#D8CEC0] bg-white/90 p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8A7C69]">{stat.label}</p>
                  <Icon className="h-5 w-5 text-[#8A7C69]" />
                </div>
                <p className="mt-6 text-4xl font-serif text-[#2E2922]">
                  {stat.value}
                </p>
              </section>
            );
          })}
        </div>

        {loadError ? (
          <div className="mt-6 rounded-2xl border border-[#E6CFC6] bg-[#F7E8E2] px-5 py-4 text-sm text-[#8A3F2B]">
            {loadError}
          </div>
        ) : null}

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-2xl border border-[#D8CEC0] bg-white/90 p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif text-[#2E2922]">Order management</h2>
                <p className="mt-2 text-[#6B6358]">
                  Track every order, update progress, and check customer delivery details.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7C69]" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search orders"
                    className="form-input rounded-full border border-[#D8CEC0] bg-[#FBF8F3] py-3 pl-10 pr-4 text-[#2E2922]"
                  />
                </label>
                <label className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="form-input appearance-none rounded-full border border-[#D8CEC0] bg-[#FBF8F3] px-5 py-3 pr-10 text-[#2E2922]"
                  >
                    <option value="all">All statuses</option>
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7C69]" />
                </label>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {filteredOrders.length ? (
                filteredOrders.map((order) => {
                  const expanded = expandedOrderId === order.id;

                  return (
                    <article
                      key={order.id}
                      className="rounded-2xl border border-[#D8CEC0] bg-[#FCFAF7] p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-[#8A7C69]">{order.order_number}</p>
                          <h3 className="mt-1 text-2xl font-serif text-[#2E2922]">
                            {order.customer_name}
                          </h3>
                          <p className="mt-2 text-sm text-[#6B6358]">
                            {formatDate(order.created_at)} · {order.customer_email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-serif text-[#2E2922]">
                            {money(order.total)}
                          </p>
                          <p className="mt-2 text-sm text-[#6B6358]">
                            {getOrderPreview(order)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_0.95fr_0.6fr_auto] lg:items-end">
                        <label className="block">
                          <span className="mb-2 block text-sm text-[#6B6358]">Order status</span>
                          <select
                            value={order.status}
                            onChange={(event) =>
                              updateOrder(order.id, {
                                status: event.target.value,
                                paymentStatus: order.payment_status,
                              })
                            }
                            className="form-input w-full rounded-full border border-[#D8CEC0] bg-white px-5 py-3 text-[#2E2922]"
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm text-[#6B6358]">Payment</span>
                          <select
                            value={order.payment_status}
                            onChange={(event) =>
                              updateOrder(order.id, {
                                status: order.status,
                                paymentStatus: event.target.value,
                              })
                            }
                            className="form-input w-full rounded-full border border-[#D8CEC0] bg-white px-5 py-3 text-[#2E2922]"
                          >
                            {paymentStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="rounded-2xl bg-[#F4ECE2] px-4 py-3 text-sm text-[#4B4338]">
                          <p>Items: {(order.items || []).length}</p>
                          <p className="mt-1">Discount: {money(order.discount)}</p>
                        </div>

                        <Button
                          type="button"
                          className="btn-outline rounded-full px-5"
                          onClick={() =>
                            setExpandedOrderId((current) =>
                              current === order.id ? null : order.id
                            )
                          }
                        >
                          {expanded ? "Hide details" : "View details"}
                        </Button>
                      </div>

                      {expanded ? (
                        <div className="mt-5 grid gap-5 border-t border-[#E6DDD1] pt-5 lg:grid-cols-[0.9fr_1.1fr]">
                          <div className="rounded-2xl bg-white p-4">
                            <h4 className="text-lg font-serif text-[#2E2922]">
                              Delivery details
                            </h4>
                            <p className="mt-3 text-sm text-[#6B6358]">
                              {order.customer_phone || "No phone provided"}
                            </p>
                            <p className="mt-2 whitespace-pre-line text-sm text-[#6B6358]">
                              {order.shipping_address}
                            </p>
                            {order.notes ? (
                              <p className="mt-3 text-sm text-[#6B6358]">
                                Notes: {order.notes}
                              </p>
                            ) : null}
                          </div>

                          <div className="rounded-2xl bg-white p-4">
                            <h4 className="text-lg font-serif text-[#2E2922]">
                              Ordered candles
                            </h4>
                            <div className="mt-4 space-y-3">
                              {(order.items || []).map((item) => (
                                <div
                                  key={item.id}
                                  className="rounded-2xl bg-[#FCFAF7] px-4 py-3 text-sm text-[#4B4338]"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <p className="font-medium text-[#2E2922]">
                                      {item.product_name}
                                    </p>
                                    <p>{money(item.line_total_pence / 100)}</p>
                                  </div>
                                  <p className="mt-1 text-[#6B6358]">
                                    {item.size_label} x {item.quantity}
                                  </p>
                                  {item.scent ? (
                                    <p className="mt-1 text-[#6B6358]">{item.scent}</p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D8CEC0] bg-[#FCFAF7] p-10 text-center text-[#6B6358]">
                  No orders match that search yet.
                </div>
              )}
            </div>
          </section>

          <section className="space-y-8">
            <form
              onSubmit={saveDiscount}
              className="rounded-2xl border border-[#D8CEC0] bg-white/90 p-6"
            >
              <h2 className="text-3xl font-serif text-[#2E2922]">
                Promo code manager
              </h2>
              <p className="mt-2 text-[#6B6358]">
                Create offers, set order minimums, and switch codes on or off.
              </p>

              <div className="mt-6 grid gap-4">
                {[
                  ["code", "Code"],
                  ["description", "Description"],
                  ["amount", "Amount"],
                  ["minOrder", "Minimum order (£)"],
                  ["startsAt", "Starts at (ISO date/time)"],
                  ["endsAt", "Ends at (ISO date/time)"],
                  ["usageLimit", "Usage limit"],
                ].map(([field, label]) => (
                  <label key={field} className="block">
                    <span className="mb-2 block text-sm text-[#6B6358]">{label}</span>
                    <input
                      value={discountForm[field]}
                      onChange={(event) =>
                        setDiscountForm((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      className="form-input w-full rounded-full border border-[#D8CEC0] bg-[#FBF8F3] px-5 py-3 text-[#2E2922]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-6 text-sm text-[#6B6358]">
                <label className="flex items-center gap-2">
                  <span>Type</span>
                  <select
                    value={discountForm.kind}
                    onChange={(event) =>
                      setDiscountForm((current) => ({
                        ...current,
                        kind: event.target.value,
                      }))
                    }
                    className="form-input rounded-full border border-[#D8CEC0] bg-[#FBF8F3] px-4 py-2"
                  >
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed amount (pence)</option>
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={discountForm.active}
                    onChange={(event) =>
                      setDiscountForm((current) => ({
                        ...current,
                        active: event.target.checked,
                      }))
                    }
                  />
                  Active
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="btn-primary rounded-full px-6"
                  disabled={saving === "discount"}
                >
                  {saving === "discount"
                    ? "Saving..."
                    : discountForm.id
                      ? "Update promo code"
                      : "Create promo code"}
                </Button>
                {discountForm.id ? (
                  <Button
                    type="button"
                    className="btn-outline rounded-full px-6"
                    onClick={() => setDiscountForm(emptyDiscount)}
                  >
                    Clear form
                  </Button>
                ) : null}
              </div>
            </form>

            <section className="rounded-2xl border border-[#D8CEC0] bg-white/90 p-6">
              <h2 className="text-3xl font-serif text-[#2E2922]">Saved promo codes</h2>
              <div className="mt-6 space-y-4">
                {discounts.length ? (
                  discounts.map((discount) => (
                    <article
                      key={discount.id}
                      className="rounded-2xl bg-[#FCFAF7] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-serif text-[#2E2922]">
                            {discount.code}
                          </p>
                          <p className="mt-1 text-sm text-[#6B6358]">
                            {discount.description || "No description added"}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#EEE2D3] px-3 py-1 text-xs text-[#4B4338]">
                          {discount.active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="mt-4 space-y-1 text-sm text-[#6B6358]">
                        <p>
                          {discount.kind === "percent"
                            ? `${discount.amount}% off`
                            : `${money(discount.amount / 100)} off`}
                        </p>
                        <p>
                          Minimum order: {money((discount.min_order_pence || 0) / 100)}
                        </p>
                        <p>
                          Used: {discount.times_used || 0}
                          {discount.usage_limit ? ` / ${discount.usage_limit}` : ""}
                        </p>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <Button
                          type="button"
                          className="btn-outline rounded-full px-5"
                          onClick={() => editDiscount(discount)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          className="btn-outline rounded-full px-5"
                          onClick={() => deleteDiscount(discount.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#D8CEC0] bg-[#FCFAF7] p-8 text-center text-[#6B6358]">
                    No promo codes created yet.
                  </div>
                )}
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
