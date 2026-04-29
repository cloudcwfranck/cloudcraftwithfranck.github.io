import { Flex, Heading, Text, Button, Tag, SmartLink } from '@/once-ui/components';
import { baseURL } from '@/app/resources';
import { unstable_setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const title = 'GovCloud MCP — AI Tools for DoD & FedRAMP Cloud Engineering';
  const description =
    '20 AI-powered tools for government cloud engineers. Compliance analysis, Big Bang configuration, ATO documentation, and DevSecOps pipelines — directly in Claude Desktop, Cursor, and VS Code.';
  const ogImage = `https://www.cloudcraftwithfranck.org/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://www.cloudcraftwithfranck.org/mcp',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

const TOOLS = [
  {
    category: 'Compliance',
    color: 'blue' as const,
    items: [
      { name: 'bicep_analyze', desc: 'Score Bicep templates for FedRAMP/IL compliance' },
      { name: 'bicep_remediate', desc: 'Auto-fix Bicep compliance violations' },
      { name: 'control_lookup', desc: 'Full NIST 800-53 control details with Azure inheritance' },
      { name: 'control_narrative', desc: 'eMASS-ready control implementation narratives' },
      { name: 'poam_generate', desc: 'Build POA&M entries from compliance gaps' },
      { name: 'ato_readiness', desc: 'Score ATO readiness with 30/60/90 day roadmap' },
      { name: 'oscal_fragment', desc: 'OSCAL 1.1.2 SSP fragments for eMASS import' },
    ],
  },
  {
    category: 'Architecture',
    color: 'green' as const,
    items: [
      { name: 'landing_zone_design', desc: 'Complete Azure government landing zone with Bicep' },
      { name: 'azure_service_selector', desc: 'Right Azure service for government workloads' },
      { name: 'gcc_high_guidance', desc: 'GCC High undocumented limitations and workarounds' },
      { name: 'private_endpoint_map', desc: 'Complete private endpoint architecture with Bicep' },
    ],
  },
  {
    category: 'Platform One',
    color: 'yellow' as const,
    items: [
      { name: 'bigbang_validate', desc: 'Score Big Bang values.yaml against DoD IL requirements' },
      { name: 'bigbang_harden', desc: 'Generate fully hardened Big Bang values.yaml' },
      { name: 'ironbank_lookup', desc: 'Iron Bank image paths, digests, and Cosign verification' },
      { name: 'addon_configurator', desc: 'Production Big Bang addon config with IB images' },
    ],
  },
  {
    category: 'Pipeline',
    color: 'orange' as const,
    items: [
      { name: 'pipeline_audit', desc: 'Audit CI/CD pipelines for DoD DevSecOps compliance' },
      { name: 'signing_config', desc: 'Cosign/Sigstore/DoD PKI artifact signing config' },
      { name: 'devsecops_scorecard', desc: 'DoD DevSecOps maturity scorecard with roadmap' },
    ],
  },
  {
    category: 'Documents',
    color: 'purple' as const,
    items: [
      { name: 'ssp_section', desc: 'eMASS-ready SSP sections (boundary, users, interconnections)' },
      { name: 'contingency_plan', desc: 'NIST 800-34 Contingency Plans with Azure recovery steps' },
    ],
  },
];

const CONFIG_SNIPPET = `{
  "mcpServers": {
    "govcloud": {
      "command": "npx",
      "args": ["-y", "@cloudcraftwithfranck/govcloud-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}`;

export default function McpPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <Flex
      as="main"
      direction="column"
      gap="64"
      paddingX="l"
      paddingY="64"
      maxWidth="xl"
      style={{ margin: '0 auto', width: '100%' }}>

      {/* Hero */}
      <Flex direction="column" gap="24">
        <Tag size="l" label="MCP Server" variant="neutral" />
        <Heading variant="display-strong-l">
          GovCloud MCP
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak" style={{ maxWidth: '640px' }}>
          20 AI-powered tools for DoD and FedRAMP cloud engineering — running directly in Claude Desktop,
          Cursor, and VS Code through the Model Context Protocol.
        </Text>
        <Flex gap="12" wrap>
          <Button
            href="https://github.com/cloudcwfranck/govcloud-mcp"
            variant="primary"
            size="m"
            prefixIcon="github"
            label="View on GitHub"
          />
          <Button
            href="https://www.npmjs.com/package/@cloudcraftwithfranck/govcloud-mcp"
            variant="secondary"
            size="m"
            label="npm package"
          />
        </Flex>
      </Flex>

      {/* Install */}
      <Flex direction="column" gap="20">
        <Heading variant="heading-strong-l">Quick Start</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Add to your Claude Desktop <code>claude_desktop_config.json</code>:
        </Text>
        <Flex
          as="pre"
          padding="24"
          radius="m"
          background="neutral-strong"
          style={{ fontFamily: 'monospace', fontSize: '13px', overflowX: 'auto', whiteSpace: 'pre' }}>
          <Text variant="body-default-s" as="code">
            {CONFIG_SNIPPET}
          </Text>
        </Flex>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Requires an{' '}
          <SmartLink href="https://console.anthropic.com">Anthropic API key</SmartLink>
          {' '}and Node.js 18+.
        </Text>
      </Flex>

      {/* Tools */}
      <Flex direction="column" gap="32">
        <Heading variant="heading-strong-l">20 Tools Across 5 Categories</Heading>
        {TOOLS.map((category) => (
          <Flex key={category.category} direction="column" gap="16">
            <Flex gap="8" alignItems="center">
              <Tag size="m" label={category.category} variant="neutral" />
              <Text variant="body-default-s" onBackground="neutral-weak">
                {category.items.length} tools
              </Text>
            </Flex>
            <Flex direction="column" gap="8">
              {category.items.map((tool) => (
                <Flex
                  key={tool.name}
                  gap="16"
                  padding="16"
                  radius="m"
                  border="neutral-weak"
                  alignItems="center">
                  <Text
                    variant="label-default-m"
                    style={{ fontFamily: 'monospace', minWidth: '220px', flexShrink: 0 }}>
                    {tool.name}
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {tool.desc}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>

      {/* Resources */}
      <Flex direction="column" gap="20">
        <Heading variant="heading-strong-l">Embedded Resources</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          The server exposes structured reference data via the <code>govcloud://</code> URI scheme.
        </Text>
        <Flex direction="column" gap="8">
          {[
            ['govcloud://nist-800-53-rev5', 'NIST 800-53 Rev 5 control catalog'],
            ['govcloud://azure-compliance-map', 'Azure service → NIST control mapping with IL availability'],
            ['govcloud://ironbank-registry', 'Iron Bank image catalog with registry paths'],
            ['govcloud://fedramp-baselines', 'FedRAMP Low/Moderate/High and DoD IL control lists'],
          ].map(([uri, desc]) => (
            <Flex key={uri} gap="16" padding="16" radius="m" border="neutral-weak" alignItems="center">
              <Text
                variant="label-default-s"
                style={{ fontFamily: 'monospace', minWidth: '280px', flexShrink: 0 }}>
                {uri}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {desc}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Example prompts */}
      <Flex direction="column" gap="20">
        <Heading variant="heading-strong-l">Example Prompts</Heading>
        <Flex direction="column" gap="8">
          {[
            'Analyze this Bicep template for FedRAMP High compliance',
            'Write an eMASS control narrative for IA-2(12) for our AKS system',
            'Generate a POA&M from these compliance findings',
            'Design an IL4 landing zone for a containerized mission app',
            'What\'s different about configuring AKS in GCC High?',
            'Validate this Big Bang values.yaml for IL4 compliance',
            'Audit this GitLab CI pipeline for DoD DevSecOps compliance',
            'Write the system description section of our SSP',
          ].map((prompt) => (
            <Flex key={prompt} padding="16" radius="m" border="neutral-weak">
              <Text variant="body-default-s">"{prompt}"</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
