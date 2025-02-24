import { useState } from "react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import api from "../../utils/api";
import styles from "./LinkManager.module.css";

const LinkManager = ({ links, setLinks }) => {
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [editingLink, setEditingLink] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await api.post("/links", newLink);
      setLinks([...links, response.data]);
      setNewLink({ title: "", url: "" });
      toast.success("Link added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLink = async (linkId) => {
    if (!editingLink) return;

    try {
      setIsSubmitting(true);
      const response = await api.put(`/links/${linkId}`, editingLink);
      setLinks(
        links.map((link) => (link._id === linkId ? response.data : link))
      );
      setEditingLink(null);
      toast.success("Link updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await api.delete(`/links/${linkId}`);
      setLinks(links.filter((link) => link._id !== linkId));
      toast.success("Link deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting link");
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLinks(items);

    try {
      await api.put("/links/reorder", { links: items });
    } catch (error) {
      toast.error("Error saving link order");
    }
  };

  return (
    <div className={styles.linkManager}>
      <h2>Manage Links</h2>

      <form onSubmit={handleAddLink} className={styles.addLinkForm}>
        <input
          type="text"
          placeholder="Link Title"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Link"}
        </button>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="links">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles.linkList}
            >
              {links.map((link, index) => (
                <Draggable key={link._id} draggableId={link._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles.linkItem}
                    >
                      {editingLink?._id === link._id ? (
                        <div className={styles.editForm}>
                          <input
                            type="text"
                            value={editingLink.title}
                            onChange={(e) =>
                              setEditingLink({
                                ...editingLink,
                                title: e.target.value,
                              })
                            }
                          />
                          <input
                            type="url"
                            value={editingLink.url}
                            onChange={(e) =>
                              setEditingLink({
                                ...editingLink,
                                url: e.target.value,
                              })
                            }
                          />
                          <button
                            onClick={() => handleUpdateLink(link._id)}
                            disabled={isSubmitting}
                          >
                            Save
                          </button>
                          <button onClick={() => setEditingLink(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className={styles.linkInfo}>
                            <h3>{link.title}</h3>
                            <p>{link.url}</p>
                          </div>
                          <div className={styles.linkActions}>
                            <button
                              onClick={() => setEditingLink(link)}
                              className={styles.editButton}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteLink(link._id)}
                              className={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LinkManager;
