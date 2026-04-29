INSERT INTO tracks VALUES
('azure-infra','Azure Infrastructure','⬡','#0078D4','#50E6FF','Azure Landing Zones, Bicep IaC, Hub-Spoke, Policy-as-Code',1),
('fedramp','FedRAMP / NIST 800-53','🛡','#C00000','#FF6B6B','SSP narratives, ConMon pipelines, POAM, control implementation',2),
('aks-eks','AKS / EKS Ops','⎈','#326CE5','#7BC8F6','Secure cluster baselines, Chainguard images, OPA Gatekeeper, Calico',3),
('devsecops','DevSecOps CI/CD','⚙','#FF6B00','#FFD700','Secure pipelines, SAST, Cosign container signing, SBOM',4),
('secops','SecOps / SIEM','◈','#8B00FF','#DA70D6','KQL detection rules, Sentinel, MITRE ATT&CK, incident response',5);

INSERT INTO assignments VALUES
('bicep-landing-zone','azure-infra','Azure Landing Zone — Bicep IaC','L2',300,'code','bicep',
'Submit a Bicep file deploying a hub-spoke network topology with NSGs, private endpoints, and diagnostic settings.',
'["Hub-spoke topology structure","NSG rules & subnet segmentation","Private endpoint configuration","Diagnostic settings & Log Analytics","Parameter files & naming conventions"]',
'// targetScope = ''subscription''\nparam location string = ''eastus''',1),
('ssp-ac2','fedramp','SSP Control Narrative — AC-2','L3',350,'text','text',
'Write a FedRAMP Moderate SSP narrative for AC-2 Account Management with implementation details, responsible roles, and evidence artifacts.',
'["Control implementation completeness","Responsible roles identified","Evidence artifacts referenced","FedRAMP narrative format","Technical specificity"]',
'AC-2 Account Management\n\nPart a. The organization identifies...',1),
('aks-secure-baseline','aks-eks','AKS Secure Baseline — DoD IL4','L3',450,'code','bicep',
'Submit a Bicep or Helm values file for AKS meeting DoD IL4: Chainguard images, OPA Gatekeeper, Calico, Azure AD Workload Identity.',
'["Chainguard/Iron Bank image references","OPA Gatekeeper constraints","Network policy Calico/Cilium","Azure AD Workload Identity","CIS benchmark node hardening"]',
'resource aksCluster ''Microsoft.ContainerService/managedClusters@2024-01-01'' = {}',1),
('pipeline-security','devsecops','Secure Pipeline — SAST + Cosign','L2',300,'code','yaml',
'Submit a GitHub Actions or Azure DevOps pipeline with SAST, Cosign container signing, Chainguard base image enforcement, and SBOM generation.',
'["SAST tool integration","Container signing Cosign/Notary v2","Base image policy enforcement","Secrets scanning Gitleaks/TruffleHog","SBOM generation"]',
'name: Secure Pipeline\non:\n  push:\n    branches: [main]',1),
('sentinel-kql','secops','Sentinel KQL — Privilege Escalation Detection','L3',400,'code','kql',
'Submit a KQL detection rule for Microsoft Sentinel identifying AAD privilege escalation, with MITRE ATT&CK TA0004 mapping.',
'["KQL logic correctness","MITRE ATT&CK TA0004 mapping","Alert tuning FP reduction","Entity mapping","Response playbook trigger"]',
'AuditLogs\n| where OperationName == "Add member to role"',1);
