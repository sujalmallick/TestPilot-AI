import { useEffect, useState } from "react";
import { projectService } from "../services/projectService";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    setProjects(projectService.getAll());
  }, []);

  const createProject = (project) => {
    const updated = [project, ...projects];

    setProjects(updated);

    projectService.saveAll(updated);

    setCurrentProject(project);
  };

  const updateProject = (updatedProject) => {
    const updated = projects.map((project) =>
      project.id === updatedProject.id
        ? updatedProject
        : project
    );

    setProjects(updated);

    projectService.saveAll(updated);

    setCurrentProject(updatedProject);
  };

  const deleteProject = (id) => {
    const updated = projects.filter(
      (project) => project.id !== id
    );

    setProjects(updated);

    projectService.saveAll(updated);

    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const selectProject = (id) => {
    const project = projects.find(
      (p) => p.id === id
    );

    setCurrentProject(project || null);
  };

  return {
    projects,
    currentProject,

    createProject,
    updateProject,
    deleteProject,
    selectProject,
  };
}