# przemg skills

Agent skills by Przemysław Gwóźdź, packaged as a Claude Code plugin marketplace.

## Install

### Claude Code plugin (recommended)

```
/plugin marketplace add przemg/skills
/plugin install przemg-in-progress@przemg
```

Recommended: turn on auto-update. It's off by default for third-party marketplaces. Run `/plugin`, open the **Marketplaces** tab, select `przemg`, then choose **Enable auto-update**. New versions then install when a session starts and load in the next one.

To update by hand instead:

```
claude plugin update przemg-in-progress@przemg
```

<details>
<summary><code>npx skills</code>: pick individual skills, or install for other agents</summary>

Installs skills outside the plugin, so plugin auto-update doesn't reach them. Works for Claude Code and other agents, but other agents aren't supported yet: the skills are written and tested for Claude Code only.

Pick skills interactively and choose which agents to install them for:

```
npx skills add przemg/skills
```

Or install one skill directly:

```
npx skills add przemg/skills --skill writing-code-comments
```

Skills installed this way don't update on their own. Run `npx skills update` to get new versions.

</details>

## Skills

### In progress

Beta skills, shipped in the `przemg-in-progress` plugin. They may change, move to a stable plugin, or be removed.

**Model-invoked**

- **[writing-code-comments](./skills/in-progress/writing-code-comments/SKILL.md)**: Write comments that say what the code can't: the reason, the constraint, the meaning a caller relies on.

## License

MIT
