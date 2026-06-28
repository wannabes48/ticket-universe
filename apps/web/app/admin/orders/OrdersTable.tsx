"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, MoreVertical, X, Check, AlertTriangle, Undo2, Save } from "lucide-react";
import { refundOrder, markOrderDelivered, openOrderDispute, updateOrderNote } from "../actions";

export default function OrdersTable({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNote, setInternalNote] = useState("");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.buyerPhone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.matchTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (actionFn: (id: string) => Promise<void>, orderId: string) => {
    setIsUpdating(true);
    try {
      await actionFn(orderId);
      // Wait a moment before closing modal so data refreshes
      setTimeout(() => {
        setSelectedOrder(null);
        setIsUpdating(false);
      }, 500);
    } catch (e) {
      console.error(e);
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search reference, email, or match..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="DELIVERED">Delivered</option>
          <option value="DISPUTED">Disputed</option>
          <option value="REFUNDED">Refunded</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">Reference</th>
              <th className="px-6 py-4 font-semibold">Buyer</th>
              <th className="px-6 py-4 font-semibold">Match</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{order.reference}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{order.buyerName}</div>
                    <div className="text-muted-foreground text-xs">{order.buyerEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{order.matchTitle}</td>
                  <td className="px-6 py-4 font-bold text-foreground">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{format(new Date(order.createdAt), "MMM d, yyyy HH:mm")}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setInternalNote(order.internalNote || "");
                      }}
                      className="text-primary hover:underline font-medium text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/10">
              <div>
                <h2 className="text-xl font-bold text-foreground">Order Details</h2>
                <p className="text-sm text-muted-foreground font-mono mt-1">{selectedOrder.reference}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Buyer Info</h3>
                  <div className="font-medium">{selectedOrder.buyerName}</div>
                  <div className="text-sm text-muted-foreground">{selectedOrder.buyerEmail}</div>
                  {selectedOrder.buyerPhone && <div className="text-sm text-muted-foreground">{selectedOrder.buyerPhone}</div>}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Match Info</h3>
                  <div className="font-medium">{selectedOrder.matchTitle}</div>
                  <div className="text-sm text-muted-foreground">{selectedOrder.quantity}x {selectedOrder.ticketCategory} Ticket(s)</div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Delivery</h3>
                  <div className="font-medium">{selectedOrder.deliveryMethod.replace(/_/g, ' ')}</div>
                  <StatusBadge status={selectedOrder.status} className="mt-2" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Payment Info</h3>
                  <div className="text-2xl font-black text-foreground">${selectedOrder.total.toLocaleString()} {selectedOrder.currency}</div>
                  <div className="text-sm text-muted-foreground mt-1">Stripe: {selectedOrder.stripePaymentIntentId || 'N/A'}</div>
                  {selectedOrder.refundProtection && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-md">
                      <Check className="w-3 h-3" /> Refund Protection Active
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Seller Info</h3>
                  <div className="font-medium">{selectedOrder.sellerEmail}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border space-y-4">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Internal Admin Note</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Add a private note about this order..."
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button 
                    onClick={() => handleAction(async (id) => {
                      await updateOrderNote(id, internalNote);
                      // Update local state to reflect change without closing modal
                      setSelectedOrder({...selectedOrder, internalNote});
                    }, selectedOrder.id)}
                    disabled={isUpdating || internalNote === (selectedOrder.internalNote || "")}
                    className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground font-bold text-sm rounded-lg hover:bg-muted/80 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> Save Note
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {selectedOrder.status !== 'REFUNDED' && (
                  <button 
                    onClick={() => handleAction(refundOrder, selectedOrder.id)}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground font-bold text-sm rounded-lg hover:bg-destructive/90 disabled:opacity-50"
                  >
                    <Undo2 className="w-4 h-4" /> Issue Refund
                  </button>
                )}
              {selectedOrder.status !== 'DISPUTED' && (
                <button 
                  onClick={() => handleAction(openOrderDispute, selectedOrder.id)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" /> Open Dispute
                </button>
              )}
              {selectedOrder.status === 'PAID' && (
                <button 
                  onClick={() => handleAction(markOrderDelivered, selectedOrder.id)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-bold text-sm rounded-lg hover:bg-emerald-600 disabled:opacity-50 ml-auto"
                >
                  <Check className="w-4 h-4" /> Mark Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, className = "" }: { status: string, className?: string }) {
  let bg = "bg-muted text-muted-foreground";
  if (status === "PAID") bg = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  if (status === "DELIVERED") bg = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  if (status === "REFUNDED") bg = "bg-destructive/10 text-destructive border border-destructive/20";
  if (status === "DISPUTED") bg = "bg-orange-500/10 text-orange-500 border border-orange-500/20";
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${bg} ${className}`}>
      {status}
    </span>
  );
}
