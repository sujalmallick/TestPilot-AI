import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/projectService";
import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectGrid from "../components/projects/ProjectGrid";
import CreateProjectModal from "../components/projects/CreateProjectModal";

import { useProjects } from "../hooks/useProjects";
import { createProject } from "../data/projectTemplate";

export default function ProjectsPage() {
  const {
    projects,
    createProject: addProject,
    updateProject,
    selectProject,
  } = useProjects();

  const [showModal, setShowModal] = useState(false);
const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  function handleCreate(data) {
    const project = createProject(data);

    addProject(project);

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

  setEditingProject(null);
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

      </div>
    </>
  );
}