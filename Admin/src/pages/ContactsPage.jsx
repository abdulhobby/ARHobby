// ContactsPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, updateContactStatus, deleteContact } from '../features/contacts/adminContactSlice';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';
import { formatDateTime } from '../utils/helpers';
import { FiTrash2, FiCheck, FiMail, FiEye, FiEyeOff, FiInbox } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactsPage = () => {
  const dispatch = useDispatch();
  const { contacts, totalContacts, page, pages, loading } = useSelector((state) => state.adminContact);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [expandedContact, setExpandedContact] = useState(null);

  useEffect(() => {
    dispatch(fetchContacts({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleMarkRead = (id) => {
    dispatch(updateContactStatus({ id, data: { isRead: true } }));
  };

  const handleMarkReplied = (id) => {
    dispatch(updateContactStatus({ id, data: { isReplied: true } }));
    toast.success('Marked as replied');
  };

  const handleDelete = () => {
    dispatch(deleteContact(deleteModal.id))
      .unwrap()
      .then(() => toast.success('Contact deleted successfully'))
      .catch((err) => toast.error(err));
    setDeleteModal({ open: false, id: null });
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Contact Messages
            <span className="ml-3 text-lg font-normal text-gray-500">({totalContacts})</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Customer inquiries and feedback</p>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <FiInbox className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">No messages found</p>
              <p className="text-xs text-gray-400 mt-1">Contact messages will appear here</p>
            </div>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden ${
                !contact.isRead 
                  ? 'border-black shadow-md' 
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              {/* Contact Header */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                      {!contact.isRead && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-black text-white">
                          New
                        </span>
                      )}
                      {contact.isReplied && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Replied
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FiMail className="w-4 h-4" />
                        {contact.email}
                      </p>
                      <p className="font-medium text-gray-900">
                        Subject: {contact.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(contact.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setExpandedContact(expandedContact === contact._id ? null : contact._id);
                      if (!contact.isRead) handleMarkRead(contact._id);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer"
                  >
                    {expandedContact === contact._id ? (
                      <>
                        <FiEyeOff className="w-4 h-4" />
                        Hide Message
                      </>
                    ) : (
                      <>
                        <FiEye className="w-4 h-4" />
                        View Message
                      </>
                    )}
                  </button>

                  {!contact.isReplied && (
                    <button
                      onClick={() => handleMarkReplied(contact._id)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 cursor-pointer"
                    >
                      <FiCheck className="w-4 h-4" />
                      Mark Replied
                    </button>
                  )}

                  <a
                    href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                  >
                    <FiMail className="w-4 h-4" />
                    Reply via Email
                  </a>

                  <button
                    onClick={() => setDeleteModal({ open: true, id: contact._id })}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 cursor-pointer ml-auto"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded Message */}
              {expandedContact === contact._id && (
                <div className="px-6 pb-6 border-t border-gray-200 pt-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination page={page} pages={pages} onPageChange={setCurrentPage} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Contact Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
};

export default ContactsPage;