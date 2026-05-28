import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { formatEventRange } from '../../utils/dateUtils';
import { ShieldAlert, HelpCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const RequestSwapModal = ({
  isOpen,
  onClose,
  targetSlot,
  mySwappableSlots = [],
  onConfirmSwap,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset selected slot when modal transitions
  useEffect(() => {
    if (isOpen) {
      setSelectedSlotId('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlotId) {
      toast.error('Please select one of your swappable slots to offer in return.');
      return;
    }
    if (!targetSlot) return;

    setIsSubmitting(true);
    try {
      await onConfirmSwap({
        mySlotId: selectedSlotId,
        theirSlotId: targetSlot.id,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!targetSlot) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Peer Slot Swap">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Targeted Peer Slot Details */}
        <div className="bg-bg-secondary border border-border/80 rounded-lg p-3.5">
          <span className="text-[10px] font-bold tracking-wider text-cyan uppercase block mb-1">
            Target Slot You Want
          </span>
          <h4 className="text-sm font-semibold text-text-primary mb-1">{targetSlot.title}</h4>
          <p className="text-xs text-text-secondary font-medium mb-1.5">
            Posted by: <span className="text-text-primary">{targetSlot.owner_name || targetSlot.user?.name || 'Peer User'}</span>
          </p>
          <p className="text-[11px] text-text-secondary font-mono mt-1 bg-black/30 inline-block px-1.5 py-0.5 rounded">
            {formatEventRange(targetSlot.start_time, targetSlot.end_time)}
          </p>
        </div>

        {/* Propose Your Swappable Slots Radio Options */}
        <div>
          <span className="text-[10px] font-bold tracking-wider text-accent uppercase block mb-2">
            Propose One of Your Swappable Slots
          </span>

          {mySwappableSlots.length === 0 ? (
            <div className="bg-danger/5 border border-danger/10 text-danger-text rounded-lg p-4 text-xs flex gap-2.5 leading-relaxed">
              <ShieldAlert size={16} className="text-danger shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary">No swappable slots available</p>
                <p className="text-text-secondary text-[11px] mt-1">
                  You cannot request a swap until you mark at least one of your "Busy" slots as "Swappable" on your Dashboard schedule.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {mySwappableSlots.map((mySlot) => (
                <label
                  key={mySlot.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 relative ${
                    selectedSlotId === String(mySlot.id)
                      ? 'border-accent bg-accent/5'
                      : 'border-border bg-black/10 hover:border-border/80'
                  }`}
                >
                  <input
                    type="radio"
                    name="my-swappable-slot"
                    className="mt-1 accent-accent"
                    value={mySlot.id}
                    checked={selectedSlotId === String(mySlot.id)}
                    onChange={() => setSelectedSlotId(String(mySlot.id))}
                    disabled={isSubmitting}
                  />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-text-primary">{mySlot.title}</div>
                    <div className="text-[10px] text-text-secondary font-mono mt-0.5">
                      {formatEventRange(mySlot.start_time, mySlot.end_time)}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-6">
          <button
            type="button"
            className="btn-ghost text-xs px-4 py-2 cursor-pointer"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary text-xs px-4 py-2 cursor-pointer flex items-center gap-1.5"
            disabled={mySwappableSlots.length === 0 || !selectedSlotId || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={12} className="animate-spin-slow" />
                <span>Requesting...</span>
              </>
            ) : (
              <span>Confirm Swap</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestSwapModal;
