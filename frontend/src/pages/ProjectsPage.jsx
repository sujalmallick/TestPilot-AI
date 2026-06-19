import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { projectService } from "../services/projectService";

import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectGrid from "../components/projects/ProjectGrid";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";

import ToastStack from "../components/shared/ToastStack";
import useToasts from "../components/shared/useToasts";

import { useProjects } from "../hooks/useProjects";
import { createProject } from "../data/projectTemplate";

export default function ProjectsPage() {
  const {
    projects,
    createProject: addProject,
    updateProject,
    deleteProject,
    selectProject,
  } = useProjects();

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { toasts, showToast } = useToasts();

  useEffect(() => {
    if (!location.state?.deleted) return;

    showToast("Project deleted successfully!");

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }, [location, navigate, showToast]);

  function handleCreate(data) {
    const project = createProject(data);

    addProject(project);

    showToast("Project created successfully!");

    setShowModal(false);
  }

  function handleRename(data) {
    const updatedProject = {
      ...editingProject,
      name: data.name,
      description: data.description,
      updatedAt: new Date().toISOString(),
    };

    updateProject(updatedProject);

    showToast("Project renamed successfully!");

    setEditingProject(null);
  }

  function handleDelete(id) {
    deleteProject(id);

    showToast("Project deleted successfully!");

    setDeletingProject(null);
  }
function handleShare(project) {
  const shareUrl = `${window.location.origin}/project/${project.id}`;

  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      showToast("Project link copied!");
    })
    .catch(() => {
      showToast("Failed to copy link.");
    });
}
  function handleOpen(id) {
    const project = projectService.getById(id);

    selectProject(id);

    if (project?.analysis) {
      navigate(`/project/${id}/workspace`);
    } else {
      navigate(`/project/${id}`);
    }
  }

  return (
    <>
      <ProjectsHeader
        onCreateProject={() => setShowModal(true)}
      />

      <div className="mx-auto max-w-7xl px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink">
            Projects
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage all your AI testing projects.
          </p>
        </div>

        <ProjectGrid
          projects={projects}
          onOpenProject={handleOpen}
          onCreateProject={() => setShowModal(true)}
          onRenameProject={setEditingProject}
          onDeleteProject={setDeletingProject}
          onShareProject={handleShare}
        />

        <CreateProjectModal
          open={showModal || !!editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onCreate={
            editingProject
              ? handleRename
              : handleCreate
          }
          initialData={editingProject}
          mode={
            editingProject
              ? "edit"
              : "create"
          }
        />

        <DeleteProjectModal
          open={!!deletingProject}
          project={deletingProject}
          onClose={() => setDeletingProject(null)}
          onDelete={handleDelete}
        />

      </div>

      <ToastStack toasts={toasts} />
    </>
  );
}