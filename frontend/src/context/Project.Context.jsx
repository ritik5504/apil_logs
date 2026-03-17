import React, {useContext, createContext, useState} from "react";
import { createProjectApi, listOfProjectApi, projectrotatekey } from "../api/Project.api";

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listOfProjectApi(); // Added await here
            // Assuming the API returns { projects: [...] } or just [...]
            setProjects(res.Projects || res || []);
            // console.log(res.Projects)
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError(err.message || "Failed to fetch projects");
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }

    const createProject = async (data) => {
        try {
            setError(null);
            const res = await createProjectApi(data);
            // Assuming the API returns the created project object
            const newProject = res.project || res;
            // console.log(newProject)
            setProjects((prev) => [newProject, ...prev]);
            return { success: true, data: newProject };
        } catch (err) {
            console.error("Error creating project:", err);
            setError(err.message || "Failed to create project");
            return { success: false, error: err.message };
        }
    };
    const value = {
        projects,
        loading,
        error,
        fetchProjects,
        createProject
    }

    return(
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    )
}

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};