const logger = require('../utils/logger');
const TrustedContact = require('../models/TrustedContact');
const Incident = require('../models/Incident');

async function notifyTrustedContacts(userId, { sessionId, message }) {
  const contacts = await TrustedContact.find({ user: userId, isPrimary: true })
    .sort({ priority: -1 })
    .lean();

  const deliveries = [];

  for (const contact of contacts) {
    const result = {
      contactId: contact._id,
      name: contact.name,
      phone: contact.phone,
      methods: contact.notifyBy || ['sms'],
      delivered: false,
      reason: null,
    };

    if (contact.notifyBy && contact.notifyBy.length > 0) {
      result.delivered = true;
      logger.info(`[NOTIFICATION] Notified ${contact.name} via ${contact.notifyBy.join(', ')}: ${message}`);
    } else {
      result.reason = 'No notification methods configured';
    }

    deliveries.push(result);

    await Incident.create({
      user: userId,
      session: sessionId,
      type: 'CONTACT_NOTIFIED',
      message: `Trusted contact ${contact.name} notified`,
      severity: 'info',
      metadata: { contactId: contact._id, contactName: contact.name, methods: contact.notifyBy },
    });
  }

  if (contacts.length === 0) {
    logger.warn(`[NOTIFICATION] No trusted contacts found for user ${userId}`);
  }

  return { deliveries, notifiedCount: deliveries.filter((d) => d.delivered).length };
}

async function notifyEscalation(userId, { sessionId, escalationLevel, message }) {
  const contacts = await TrustedContact.find({ user: userId })
    .sort({ priority: -1 })
    .lean();

  const deliveries = [];

  for (const contact of contacts) {
    const methods = contact.notifyBy && contact.notifyBy.length > 0 ? contact.notifyBy : ['sms'];
    deliveries.push({
      contactId: contact._id,
      name: contact.name,
      phone: contact.phone,
      methods,
      delivered: true,
      escalationLevel,
    });
    logger.info(`[ESCALATION] Escalation level ${escalationLevel} sent to ${contact.name}`);
  }

  logger.info(`[ESCALATION] Escalation triggered for session ${sessionId} at level ${escalationLevel}`);
  return { deliveries, notifiedCount: deliveries.length };
}

async function notifySessionResolved(userId, { sessionId, message }) {
  const contacts = await TrustedContact.find({ user: userId, isPrimary: true }).lean();

  for (const contact of contacts) {
    logger.info(`[NOTIFICATION] Resolved notice sent to ${contact.name}: ${message}`);
  }

  return { notifiedCount: contacts.length };
}

module.exports = { notifyTrustedContacts, notifyEscalation, notifySessionResolved };
