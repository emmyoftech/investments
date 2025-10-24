import emailjs from "@emailjs/browser";
import logger from "@/lib/logger";

export const runtime = "nodejs";

// Initialize EmailJS
const initEmailJS = () => {
  emailjs.init(process.env.EMAILJS_PUBLIC_KEY || "JmQjPLQLPRNYM5Vgp");
};

// Send withdrawal request notification to admin
export async function sendWithdrawalRequestEmail(withdrawalData: {
  withdrawalId: number;
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
  address: string;
  transactionRef: string;
}) {
  try {
    initEmailJS();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL environment variable is not set");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const approveUrl = `${baseUrl}/api/withdrawal/approve?withdrawalId=${withdrawalData.withdrawalId}&action=approve&adminEmail=${encodeURIComponent(adminEmail)}`;
    const rejectUrl = `${baseUrl}/api/withdrawal/approve?withdrawalId=${withdrawalData.withdrawalId}&action=reject&adminEmail=${encodeURIComponent(adminEmail)}`;

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID || "service_kxp9p3i",
      process.env.EMAILJS_TEMPLATE_ID || "templates_695nv8c",
      {
        to_email: adminEmail,
        subject: "Withdrawal Request Awaiting Approval",
        message: `
          A new withdrawal requires approval.

          👤 User: ${withdrawalData.userEmail} (${withdrawalData.userName})
          💰 Amount: $${withdrawalData.amount}
          💳 Method: ${withdrawalData.currency}
          🧾 Wallet Address: ${withdrawalData.address}
          🔗 Transaction Ref: ${withdrawalData.transactionRef}

          Approve: ${approveUrl}
          Reject: ${rejectUrl}
        `,
      },
      process.env.EMAILJS_PUBLIC_KEY || "JmQjPLQLPRNYM5Vgp"
    );

    logger.info({
      message: "Withdrawal request email sent to admin",
      withdrawalId: withdrawalData.withdrawalId,
      userEmail: withdrawalData.userEmail,
      amount: withdrawalData.amount,
    });
  } catch (error) {
    logger.error({
      message: "Failed to send withdrawal request email",
      error: error instanceof Error ? error.message : "Unknown error",
      withdrawalId: withdrawalData.withdrawalId,
    });
    throw error;
  }
}

// Send withdrawal status notification to user
export async function sendWithdrawalStatusEmail(withdrawalData: {
  userEmail: string;
  amount: number;
  status: "Completed" | "Rejected";
}) {
  try {
    initEmailJS();

    const statusMessage = withdrawalData.status === "Completed"
      ? "Your withdrawal has been approved and funds will be processed shortly."
      : "Your withdrawal request has been rejected. Please contact support if you have questions.";

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID || "service_kxp9p3i",
      process.env.EMAILJS_TEMPLATE_ID || "templates_695nv8c",
      {
        to_email: withdrawalData.userEmail,
        subject: `Withdrawal ${withdrawalData.status}`,
        message: `Your withdrawal request of $${withdrawalData.amount} has been ${withdrawalData.status.toLowerCase()}.\n\n${statusMessage}`,
      },
      process.env.EMAILJS_PUBLIC_KEY || "JmQjPLQLPRNYM5Vgp"
    );

    logger.info({
      message: "Withdrawal status email sent to user",
      userEmail: withdrawalData.userEmail,
      amount: withdrawalData.amount,
      status: withdrawalData.status,
    });
  } catch (error) {
    logger.error({
      message: "Failed to send withdrawal status email",
      error: error instanceof Error ? error.message : "Unknown error",
      userEmail: withdrawalData.userEmail,
      status: withdrawalData.status,
    });
    throw error;
  }
}
