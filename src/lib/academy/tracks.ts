export const TRACKS = [
  { id: 'azure-infra', name: 'Azure Infrastructure', icon: '⬡', color: '#0078D4', accent: '#50E6FF', description: 'Azure Landing Zones, Bicep IaC, Hub-Spoke, Policy-as-Code', assignments: [
    { id: 'bicep-landing-zone', title: 'Azure Landing Zone — Bicep IaC', level: 'L2', xp: 300, lang: 'bicep', description: 'Submit a Bicep file deploying a hub-spoke network topology with NSGs, private endpoints, and diagnostic settings.', rubric: ['Hub-spoke topology structure','NSG rules & subnet segmentation','Private endpoint configuration','Diagnostic settings & Log Analytics','Parameter files & naming conventions'], placeholder: '// targetScope = \'subscription\'\nparam location string = \'eastus\'\n\nmodule hubNetwork \'./modules/hub-vnet.bicep\' = {\n  name: \'hubNetworkDeploy\'\n}' }
  ]},
  { id: 'fedramp', name: 'FedRAMP / NIST 800-53', icon: '🛡', color: '#C00000', accent: '#FF6B6B', description: 'SSP narratives, ConMon pipelines, POAM, control implementation', assignments: [
    { id: 'ssp-ac2', title: 'SSP Control Narrative — AC-2', level: 'L3', xp: 350, lang: 'text', description: 'Write a FedRAMP Moderate SSP narrative for AC-2 Account Management with implementation details, responsible roles, and evidence artifacts.', rubric: ['Control implementation completeness','Responsible roles identified','Evidence artifacts referenced','FedRAMP narrative format','Technical specificity'], placeholder: 'AC-2 Account Management\n\nPart a. The organization identifies and selects the following types of information system accounts...\n\n[Describe your implementation here]' }
  ]},
  { id: 'aks-eks', name: 'AKS / EKS Ops', icon: '⎈', color: '#326CE5', accent: '#7BC8F6', description: 'Secure cluster baselines, Chainguard images, OPA Gatekeeper, Calico', assignments: [
    { id: 'aks-secure-baseline', title: 'AKS Secure Baseline — DoD IL4', level: 'L3', xp: 450, lang: 'bicep', description: 'Submit a Bicep or Helm values file for AKS meeting DoD IL4: Chainguard images, OPA Gatekeeper, Calico, Azure AD Workload Identity.', rubric: ['Chainguard/Iron Bank image references','OPA Gatekeeper constraints','Network policy Calico/Cilium','Azure AD Workload Identity','CIS benchmark node hardening'], placeholder: 'resource aksCluster \'Microsoft.ContainerService/managedClusters@2024-01-01\' = {\n  name: clusterName\n  location: location\n}' }
  ]},
  { id: 'devsecops', name: 'DevSecOps CI/CD', icon: '⚙', color: '#FF6B00', accent: '#FFD700', description: 'Secure pipelines, SAST, Cosign container signing, SBOM', assignments: [
    { id: 'pipeline-security', title: 'Secure Pipeline — SAST + Cosign', level: 'L2', xp: 300, lang: 'yaml', description: 'Submit a GitHub Actions or Azure DevOps pipeline with SAST, Cosign container signing, and SBOM generation.', rubric: ['SAST tool integration','Container signing Cosign/Notary v2','Base image policy enforcement','Secrets scanning Gitleaks/TruffleHog','SBOM generation'], placeholder: 'name: Secure Pipeline\non:\n  push:\n    branches: [main]\njobs:\n  security-gate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4' }
  ]},
  { id: 'secops', name: 'SecOps / SIEM', icon: '◈', color: '#8B00FF', accent: '#DA70D6', description: 'KQL detection rules, Sentinel, MITRE ATT&CK, incident response', assignments: [
    { id: 'sentinel-kql', title: 'Sentinel KQL — Privilege Escalation', level: 'L3', xp: 400, lang: 'kql', description: 'Submit a KQL detection rule for Microsoft Sentinel identifying AAD privilege escalation with MITRE ATT&CK TA0004 mapping.', rubric: ['KQL logic correctness','MITRE ATT&CK TA0004 mapping','Alert tuning FP reduction','Entity mapping','Response playbook trigger'], placeholder: 'AuditLogs\n| where OperationName == "Add member to role"\n| where Result == "success"\n| extend Role = tostring(TargetResources[0].displayName)\n| where Role in ("Global Administrator","Privileged Role Administrator")' }
  ]},
]

export function getTrack(id: string) {
  return TRACKS.find(t => t.id === id) ?? null
}

export function getAssignment(trackId: string, assignmentId: string) {
  const track = getTrack(trackId)
  return track?.assignments.find(a => a.id === assignmentId) ?? null
}
