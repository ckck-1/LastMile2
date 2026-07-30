import React, { useState } from "react";
import { Send, Smartphone, CheckCircle, AlertCircle, Info, Loader2, Code2, Terminal } from "lucide-react";
import { SmsSendResult } from "../types";
import { sendSmsAlert } from "../services/api";

interface SmsDisseminationProps {
  alertText: string;
  alertTitle: string;
  locationName: string;
}

export const SmsDissemination: React.FC<SmsDisseminationProps> = ({
  alertText,
  alertTitle,
  locationName,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("+254700000000");
  const [isSending, setIsSending] = useState(false);
  const [smsResult, setSmsResult] = useState<SmsSendResult | null>(null);

  const fullSmsMessage = `[LASTMILE ALERT - ${locationName.toUpperCase()}] ${alertTitle}: ${alertText}`;

  const handleSendSms = async (e: React.FormEvent, forceSim = false) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSending(true);
    setSmsResult(null);

    try {
      const result = await sendSmsAlert(phoneNumber, fullSmsMessage, forceSim);
      setSmsResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSmsResult({
        success: false,
        connected: false,
        error: `HTTP Client Error: ${msg}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="tech-panel mb-6">
      <div className="tech-pane-title flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-[#D94A38]" />
          <span>Africa&apos;s Talking Telecom SMS Gateway</span>
        </div>
        <span className="bg-[#2E7D32] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 font-technical-mono">
          Ready
        </span>
      </div>

      {/* Message Preview Box */}
      <div className="p-4 border-b border-[#141414] bg-[#E4E3E0] font-technical-mono text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-[#D94A38] uppercase text-[10px]">
            SMS Payload ({fullSmsMessage.length} chars / GSM-7):
          </span>
          <span className="text-[10px] text-[#141414]/70">E.164 Cellular Protocol</span>
        </div>
        <p className="bg-white border border-[#141414] p-3 text-[#141414] leading-relaxed">
          {fullSmsMessage}
        </p>
      </div>

      {/* Phone Number Input Form */}
      <div className="p-4 sm:p-5 font-technical-mono text-xs">
        <form onSubmit={handleSendSms} className="mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase text-[#141414] mb-1">
                Recipient Mobile Number (E.164 format, e.g. +254700000000)
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+254700000000"
                className="w-full bg-[#E4E3E0] border border-[#141414] text-[#141414] font-technical-mono px-3 py-2 text-xs focus:outline-none focus:bg-white"
                disabled={isSending}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={isSending || !phoneNumber.trim()}
                className="tech-btn-accent flex items-center justify-center space-x-1 shrink-0 h-9"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Live SMS API</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => handleSendSms(e, true)}
                disabled={isSending || !phoneNumber.trim()}
                className="tech-btn flex items-center justify-center space-x-1 shrink-0 h-9 bg-white border border-[#141414]"
              >
                <Code2 className="w-3.5 h-3.5 text-[#D94A38]" />
                <span>Test Sandbox Mode</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Response & Connection Status Box */}
        {smsResult && (
          <div
            className={`p-4 border text-xs font-technical-mono ${
              smsResult.success
                ? "bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]"
                : !smsResult.connected
                ? "bg-[#FFF8E1] border-[#141414] text-[#141414]"
                : "bg-[#FFEBEE] border-[#D94A38] text-[#D94A38]"
            }`}
          >
            <div className="flex items-start space-x-2.5 mb-2">
              {smsResult.success ? (
                <CheckCircle className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#D94A38] shrink-0 mt-0.5" />
              )}

              <div className="flex-1">
                <h4 className="font-bold text-sm uppercase">
                  {smsResult.success
                    ? "SMS Alert Dispatched!"
                    : !smsResult.connected
                    ? "Africa's Talking Credentials Required (HTTP 401)"
                    : "SMS Dispatch Error"}
                </h4>
                <p className="mt-0.5 opacity-90 leading-relaxed">
                  {smsResult.error || `Status: ${smsResult.status || "Delivered"}`}
                </p>
              </div>
            </div>

            {/* Setup Instructions if Not Connected or HTTP 401 */}
            {!smsResult.connected && (
              <div className="mt-3 p-3 bg-white border border-[#141414] text-[11px] text-[#141414]">
                <p className="font-bold text-[#D94A38] mb-1 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>How to fix Africa&apos;s Talking HTTP 401 Unauthorized:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[#141414]/90">
                  <li>Log in to <a href="https://africastalking.com" target="_blank" rel="noreferrer" className="underline font-bold text-[#D94A38]">africastalking.com</a> dashboard.</li>
                  <li>Go to <strong>Sandbox App &gt; Settings &gt; API Key</strong> and generate/copy your valid API key.</li>
                  <li>In this AI Studio panel, go to <strong>Settings &gt; Secrets</strong>.</li>
                  <li>Set <code className="bg-[#E4E3E0] px-1 border border-[#141414]">AT_USERNAME=&quot;sandbox&quot;</code> and <code className="bg-[#E4E3E0] px-1 border border-[#141414]">AT_API_KEY=&quot;YOUR_NEW_API_KEY&quot;</code>.</li>
                  <li>Or click <strong>&quot;Test Sandbox Mode&quot;</strong> above to verify SMS payload formatting immediately.</li>
                </ol>
              </div>
            )}

            {/* Carrier Delivery Notice for Sandbox vs Live Physical Phones */}
            {smsResult.connected && (
              <div className="mt-3 p-3 bg-[#F4F4F0] border border-[#141414] text-[11px] text-[#141414]">
                <p className="font-bold text-[#141414] mb-1 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-[#D94A38]" />
                  <span>Why Sandbox SMS Shows &quot;DeliveryFailure&quot; on Real Phones (+250 Rwanda, etc.):</span>
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#141414]/90">
                  <li><strong>Sandbox Restriction:</strong> Africa&apos;s Talking Sandbox API accepts calls (<code className="bg-[#E4E3E0] px-1">StatusCode: 101</code>), but routes messages to the <strong>Africa&apos;s Talking Mobile Simulator App</strong> rather than real mobile towers.</li>
                  <li><strong>Carrier Restrictions in Rwanda (+250):</strong> MTN &amp; Airtel Rwanda block unregistered default sender IDs (<code className="bg-[#E4E3E0] px-1">AFRICASTKNG</code>) on physical handsets.</li>
                  <li><strong>To Deliver SMS to Real Physical Handsets:</strong> Switch <code className="bg-[#E4E3E0] px-1">AT_USERNAME</code> to your live <strong>Production App Name</strong> in <strong>Settings &gt; Secrets</strong>, add your live Production API Key, and fund your account wallet.</li>
                </ul>
              </div>
            )}

            {/* Raw API Response Log for Judges */}
            {smsResult.rawResponse && (
              <div className="mt-3 pt-3 border-t border-[#141414]/20 font-technical-mono text-[10px]">
                <div className="flex items-center space-x-1 font-bold text-[#141414] mb-1">
                  <Terminal className="w-3 h-3 text-[#D94A38]" />
                  <span>Africa&apos;s Talking Raw HTTP Response:</span>
                </div>
                <pre className="bg-[#141414] text-white p-2.5 overflow-x-auto text-[10px]">
                  {JSON.stringify(smsResult.rawResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
