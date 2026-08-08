/* Identity Activity Analysis — final swimlane design (empty lanes omitted at render) */
window.IR_DATA = (function () {
  var LANES = [
    { id: 'user', label: 'User', color: '#16A34A' },
    { id: 'admin', label: 'Administrative Roles', color: '#7C3AED' },
    { id: 'service', label: 'Service Account', color: '#64748B' },
    { id: 'application', label: 'Enterprise Application', color: '#EA580C' },
    { id: 'group', label: 'Group', color: '#2563EB' },
    { id: 'auth', label: 'Authentication Method', color: '#65A30D' },
    { id: 'sp', label: 'Service Principal', color: '#DC2626' }
  ];

  var TIMES = [
    { id: 't0', label: 'Jun 10 12:00' },
    { id: 't1', label: 'Jun 10 18:00' },
    { id: 't2', label: 'Jun 12 12:00' },
    { id: 't3', label: 'Jun 12 18:00' },
    { id: 't4', label: 'Jun 14 12:00' }
  ];

  function node(id, lane, time, title, subtitle, selected) {
    return { id: id, lane: lane, time: time, title: title, subtitle: subtitle, selected: !!selected };
  }

  function edge(from, to, action, tone, sev, tactic, tech, scenario, recovery) {
    return {
      from: from,
      to: to,
      action: action,
      tone: tone || 'rose',
      sev: sev || 'High',
      tactic: tactic,
      tech: tech,
      scenario: scenario,
      recovery: recovery
    };
  }

  var metrics = [
    { value: '11', label: 'Total Events' },
    { value: '9', label: 'Changed Objects' },
    { value: '2', label: 'Persistence' },
    { value: '3', label: 'Privilege Escalation' },
    { value: '1', label: 'Defense Evasion' },
    { value: '6', label: 'Credential Access' },
    { value: '4', label: 'Impact' }
  ];

  var entra = {
    platform: 'Entra ID',
    rangeLabel: '10 Jun 2026, 12:00 – 12 Jun 2026, 12:00',
    identity: {
      name: 'Alice Smith',
      type: 'User',
      source: 'Entra ID',
      start: '10 Jun, 2026',
      end: '15 Jun, 2026'
    },
    metrics: metrics,
    gap: { after: 't1', label: '2 days gap' },
    nodes: [
      node('alice', 'user', 't0', 'Alice Smith', 'User', true),
      node('sarah', 'user', 't2', 'Sarah Ops', 'User'),
      node('ga', 'admin', 't1', 'Global Admin', 'Privileged Role'),
      node('svc', 'service', 't2', 'deploy-bot', 'Service Account'),
      node('jira', 'application', 't2', 'Jira Cloud', 'Enterprise App'),
      node('ops', 'group', 't3', 'Ops Controllers', 'Group'),
      node('phone', 'auth', 't3', 'Alice-Phone 02', 'Authentication Method'),
      node('sp1', 'sp', 't4', 'Jira Cloud SP', 'Service Principal')
    ],
    edges: [
      edge('alice', 'ga', 'Added', 'rose', 'High', 'Privilege Escalation', 'T1098',
        'Compromised user obtains Global Admin role assignment.',
        'Remove illicit role; require PIM + approval for GA.'),
      edge('alice', 'sarah', 'Added', 'rose', 'High', 'Persistence', 'T1136.003',
        'New operator-style user created as a secondary foothold.',
        'Disable Sarah Ops if illicit; alert on admin-created users.'),
      edge('alice', 'svc', 'Modified', 'amber', 'High', 'Credential Access', 'T1528',
        'Service account credentials/permissions reshaped for automation abuse.',
        'Rotate secrets; tighten service account roles.'),
      edge('svc', 'jira', 'Added', 'rose', 'Med', 'Persistence', 'T1528',
        'Enterprise app consent extended for ongoing API reach.',
        'Revoke consent; audit high-privilege app grants.'),
      edge('alice', 'ops', 'Added', 'amber', 'Med', 'Collection', 'T1078',
        'Group membership expands access into ops-controlled resources.',
        'Revert membership; review group-based access.'),
      edge('alice', 'phone', 'Added', 'rose', 'High', 'Persistence', 'T1556.006',
        'New authentication method enrolled on attacker-controlled device.',
        'Remove unknown MFA methods; require supervised re-enrollment.'),
      edge('jira', 'sp1', 'Created', 'rose', 'High', 'Privilege Escalation', 'T1098.001',
        'Service principal created for non-interactive Graph access.',
        'Disable/delete SP; rotate secrets; monitor SP creation.')
    ]
  };

  var okta = {
    platform: 'Okta',
    rangeLabel: '10 Jun 2026, 12:00 – 12 Jun 2026, 12:00',
    identity: {
      name: 'Alice Smith',
      type: 'User',
      source: 'Okta',
      start: '10 Jun, 2026',
      end: '15 Jun, 2026'
    },
    metrics: metrics,
    gap: { after: 't1', label: '2 days gap' },
    nodes: [
      node('alice', 'user', 't0', 'Alice Smith', 'User', true),
      node('sarah', 'user', 't2', 'Sarah Ops', 'User'),
      node('ga', 'admin', 't1', 'Super Admin', 'Admin Role'),
      node('svc', 'service', 't2', 'deploy-bot', 'API Token owner'),
      node('jira', 'application', 't2', 'Jira Cloud', 'OIDC App'),
      node('ops', 'group', 't3', 'Ops Controllers', 'Group'),
      node('phone', 'auth', 't3', 'Alice-Phone 02', 'Okta Factor'),
      node('sp1', 'sp', 't4', 'Jira API Token', 'API Token')
    ],
    edges: [
      edge('alice', 'ga', 'Added', 'rose', 'High', 'Privilege Escalation', 'T1098',
        'Compromised Okta user receives Super Admin.',
        'Remove role; enforce admin approval workflow.'),
      edge('alice', 'sarah', 'Added', 'rose', 'High', 'Persistence', 'T1136.003',
        'Secondary user created as persistence.',
        'Suspend illicit user; tighten create privileges.'),
      edge('alice', 'svc', 'Modified', 'amber', 'High', 'Credential Access', 'T1528',
        'Service credentials reshaped for API abuse.',
        'Revoke tokens; enforce short TTL.'),
      edge('svc', 'jira', 'Added', 'rose', 'Med', 'Persistence', 'T1528',
        'OIDC app scopes expanded for lasting access.',
        'Deactivate app; rotate client secrets.'),
      edge('alice', 'ops', 'Added', 'amber', 'Med', 'Collection', 'T1078',
        'Group assignment opens ops app SSO.',
        'Revert assignment; review app admins.'),
      edge('alice', 'phone', 'Added', 'rose', 'High', 'Persistence', 'T1556.006',
        'New Okta factor enrolled on attacker hardware.',
        'Remove unknown factors; require supervised re-enrollment.'),
      edge('jira', 'sp1', 'Created', 'rose', 'High', 'Privilege Escalation', 'T1098.001',
        'Long-lived API token minted for non-interactive access.',
        'Revoke token; alert on token creation.')
    ]
  };

  return { LANES: LANES, TIMES: TIMES, platforms: { entra: entra, okta: okta } };
})();
