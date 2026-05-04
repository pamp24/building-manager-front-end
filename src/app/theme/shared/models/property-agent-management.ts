export interface AgentBuildingResponse {
  id: number;
  name: string;
}

export interface PropertyAgentManagementResponse {
  id: number;
  fullName: string;
  email: string;
  assignedBuildings: AgentBuildingResponse[];
}

export interface UpdatePropertyAgentBuildingsRequest {
  buildingIds: number[];
}