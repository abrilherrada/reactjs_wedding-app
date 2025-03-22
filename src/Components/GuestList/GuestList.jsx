import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/Auth/useAuth';
import { getWeddingInvitations, updateInvitationSentStatus } from '../../services/wedding_services';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import styles from './GuestList.module.css';

const GuestList = () => {
  const { id: weddingId } = useParams();
  const { token } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState({
    single: '¡Hola, {todos}! Como seguro ya sabés, ¡nos casamos! 👰🏼‍♀️🤵🏻‍♂️ Nos encantaría que seas parte de este día tan importante para nosotros. 🤍 En el siguiente enlace, vas a encontrar toda la información sobre la boda y vas a poder avisarnos si te sumás a festejar con nosotros:',
    group: '¡Hola, {todos}! Como seguro ya saben, ¡nos casamos! 👰🏼‍♀️🤵🏻‍♂️ Nos encantaría que sean parte de este día tan importante para nosotros. 🤍 En el siguiente enlace, van a encontrar toda la información sobre la boda y van a poder avisarnos si se suman a festejar con nosotros:'
  });

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getWeddingInvitations(weddingId, token);
        setInvitations(data);
        setSentInvitations(data.filter(inv => inv.sent).map(inv => inv._id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [weddingId, token]);

  const getPartySize = (invitation, onlyAdults = false) => {
    if (onlyAdults) {
      return 1 + (invitation.companion ? 1 : 0);
    }
    return 1 + // mainGuest
      (invitation.companion ? 1 : 0) +
      invitation.children.length;
  };

  const replaceTemplateVariables = (text, invitation) => {
    const adults = [invitation.mainGuest.name]
      .concat(invitation.companion ? [invitation.companion.name] : [])
      .filter(Boolean)
      .join(' y ');

    const allGuests = [invitation.mainGuest.name]
      .concat(invitation.companion ? [invitation.companion.name] : [])
      .concat(invitation.children.map(child => child.name))
      .filter(Boolean)
      .join(', ')
      .replace(/,([^,]*)$/, ' y$1'); // Replace last comma with 'y'

    return text
      .replace(/{adultos}/g, adults)
      .replace(/{todos}/g, allGuests);
  };

  const getFullMessage = (invitation) => {
    const usesAdultsVar = {
      single: messages.single.includes('{adultos}'),
      group: messages.group.includes('{adultos}')
    };

    const isGroup = usesAdultsVar.single || usesAdultsVar.group
      ? getPartySize(invitation, true) > 1  // Count only adults if {adultos} is used
      : getPartySize(invitation) > 1;       // Count everyone if {todos} is used

    const messageTemplate = isGroup ? messages.group : messages.single;
    const personalizedMessage = replaceTemplateVariables(messageTemplate, invitation);
    const invitationUrl = `${import.meta.env.VITE_SITE_URL}/?inv=${invitation._id}`;
    return `${personalizedMessage} ${invitationUrl}`;
  };

  const handleWhatsAppClick = async (phone, invitationId, invitation) => {
    const formattedPhone = phone.replace(/\D/g, '');
    const phoneWithPlusSign = formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`;
    const invitationMessage = getFullMessage(invitation);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneWithPlusSign}&text=${encodeURIComponent(invitationMessage)}`;

    window.open(whatsappUrl, '_blank');

    try {
      await updateInvitationSentStatus(invitationId, true);
      setSentInvitations(prev => [...prev, invitationId]);
    } catch (error) {
      console.error('Failed to mark invitation as sent:', error);
    }
  };

  const openWhatsAppChat = (phone) => {
    const formattedPhone = phone.replace(/\D/g, '');
    const phoneWithPlusSign = formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`;
    const whatsappUrl = `https://wa.me/${phoneWithPlusSign}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleSentToggle = async (invitationId) => {
    try {
      const newSentStatus = !sentInvitations.includes(invitationId);
      await updateInvitationSentStatus(invitationId, newSentStatus);
      setSentInvitations(prev => {
        if (newSentStatus) {
          return [...prev, invitationId];
        } else {
          return prev.filter(id => id !== invitationId);
        }
      });
    } catch (error) {
      console.error('Failed to toggle invitation status:', error);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Invitados</h2>
      <div className={styles.messageContainer}>
        <div className={styles.messageGroup}>
          <label htmlFor="singleMessage">Mensaje para invitados individuales:</label>
          <textarea
            id="singleMessage"
            value={messages.single}
            onChange={(e) => setMessages(prev => ({ ...prev, single: e.target.value }))}
            className={styles.messageInput}
            rows={10}
          />
        </div>
        <div className={styles.messageGroup}>
          <label htmlFor="groupMessage">Mensaje para grupos:</label>
          <textarea
            id="groupMessage"
            value={messages.group}
            onChange={(e) => setMessages(prev => ({ ...prev, group: e.target.value }))}
            className={styles.messageInput}
            rows={10}
          />
        </div>
      </div>
      <div className={styles.messageInfo}>
        <p className={styles.infoTitle}>Variables disponibles:</p>
        <ul className={styles.infoList}>
          <li className={styles.infoItem}>
            <code className={styles.infoVariable}>{'{adultos}'}</code>: nombres de los invitados adultos
          </li>
          <li className={styles.infoItem}>
            <code className={styles.infoVariable}>{'{todos}'}</code>: nombres de todos los invitados (adultos y niños)
          </li>
        </ul>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Adultos</th>
              <th>Menores</th>
              <th>Teléfono</th>
              <th>Vista previa</th>
              <th>Enviado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map(invitation => (
              <tr 
                key={invitation._id}
                className={sentInvitations.includes(invitation._id) ? styles.sentRow : ''}
              >
                <td>
                  <ul className={styles.guestList}>
                    <li>{invitation.mainGuest?.name}</li>
                    {invitation.companion &&
                      <li>{invitation.companion?.name}</li>
                    }
                  </ul>
                </td>
                <td>
                  <ul className={styles.guestList}>
                    {invitation.children.length > 0 &&
                      invitation.children.map((child, index) => (
                        <li key={index}>{child?.name}</li>
                      ))}
                  </ul>
                </td>
                <td>{invitation.phone}</td>
                <td>
                  <p className={styles.preview}>
                    {getFullMessage(invitation)}
                  </p>
                </td>
                <td>
                  <label className={styles.sentCheckbox}>
                    <input
                      type="checkbox"
                      checked={sentInvitations.includes(invitation._id)}
                      onChange={() => handleSentToggle(invitation._id)}
                    />
                    <span className={styles.checkmark}></span>
                  </label>
                </td>
                <td>
                  <div className={styles.buttonGroup}>
                    <Button
                      onClick={() => handleWhatsAppClick(invitation.phone, invitation._id, invitation)}
                      disabled={!invitation.phone}
                      className={styles.whatsappButton}
                    >
                      Enviar por WhatsApp
                    </Button>
                    <Button
                      onClick={() => openWhatsAppChat(invitation.phone)}
                      disabled={!invitation.phone}
                      className={styles.chatButton}
                    >
                      Ver chat
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestList;