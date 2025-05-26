import pool from "../config/db.js";
import { fetchEmailsForUserType } from "./functions.js";
import mailer from "./mailer.js";
import cron from "node-cron";

const USER_TYPE_FLOW = { 5: "4", 4: "3", 3: "2" };

export const sendBatchNotifications = async () => {
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.execute(
        `SELECT btp.*, b.batch_code 
         FROM batch_time_periods btp 
         JOIN batch b ON btp.batch_id = b.batch_id 
         WHERE (btp.end_date <= NOW() AND btp.mail_sent = 0 AND btp.user_type != '2' AND btp.user_type != '5') OR (b.application_open < NOW() AND btp.mail_sent = 0 AND user_type = '5')`
      );

      for (const row of rows) {
        const { batch_id, user_type, id, batch_code } = row;

        const nextUserType = USER_TYPE_FLOW[user_type];

        if (!nextUserType) continue;

        const data = await fetchEmailsForUserType(conn, batch_id, nextUserType);

        if (data.length > 0) {
          const dealine = new Date(data[0].endDate)
            .toString()
            .slice(4, new Date(data[0].endDate).toString().indexOf("GMT"));
          const mails = data.map((obj) => obj.email).join(",");

          try {
            await mailer(
              mails,
              `Action Required: Batch ${batch_code} - Your Access is Open`,
              `
  <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;background:#fff;border:1px solid #000;border-radius:6px;overflow:hidden;">
    <div style="background:#000;color:#fff;padding:20px;text-align:center;">
      <h1 style="margin:0;font-size:22px;">Batch Access Notification</h1>
    </div>
    <div style="padding:30px;">
      <h2 style="margin-top:0;color:#000;font-size:20px;">Action Required</h2>
      <p style="font-size:15px;color:#000;line-height:1.6;">
        You can now access the <strong>entry forms</strong> for <strong>Batch ${batch_code}</strong>.
      </p>
      <p style="font-size:15px;color:#000;">
        Please complete your review before the deadline.
      </p>

      <div style="margin:20px 0;padding:15px;border:1px solid #000;background:#fdfdfd;">
        <p style="margin:0;font-size:15px;"><strong>Access Deadline:</strong> ${dealine}</p>
      </div>

      <hr style="margin:30px 0;border:0;border-top:1px solid #000;" />

      <p style="font-size:14px;color:#000;text-align:center;">
        For any inquiries, please contact the <strong>Examination Branch</strong>.
      </p>
    </div>
    <div style="background:#000;color:#fff;text-align:center;padding:10px;font-size:12px;">
      &copy; ${new Date().getFullYear()} University&nbsp;of&nbsp;Vavuniya.
            All&nbsp;rights&nbsp;reserved.
    </div>
  </div>
  `
            );

            await conn.execute(
              `UPDATE batch_time_periods SET mail_sent = 1 WHERE id = ?`,
              [id]
            );
          } catch (mailError) {
            console.error(
              `Failed to send mail for batch ${batch_id}:`,
              mailError
            );
          }
        }
      }

      await conn.commit();
    } catch (error) {
      console.error("Error in cron job:", error);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

cron.schedule("5 */1 * * *", sendBatchNotifications);
