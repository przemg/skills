# przemg skills

Agent skills by Przemysław Gwóźdź, packaged as a Claude Code plugin marketplace.

## Install

**Recommended: Claude Code plugin**

```
/plugin marketplace add przemg/skills
/plugin install przemg-in-progress@przemg
```

Plugins from third-party marketplaces don't update automatically. To get the latest version:

```
/plugin marketplace update przemg
```

<details>
<summary>Other agents: <code>npx skills</code></summary>

Pick skills interactively and choose which agents to install them for:

```
npx skills add przemg/skills
```

Or install one skill directly:

```
npx skills add przemg/skills --skill writing-code-comments
```

Update installed skills with `npx skills update`.

</details>

## Skills

### In progress

Beta skills, shipped in the `przemg-in-progress` plugin. They may change, move to a stable plugin, or be removed.

**Model-invoked**

- **[writing-code-comments](./skills/in-progress/writing-code-comments/SKILL.md)**: Write comments that say what the code can't: the reason, the constraint, the meaning a caller relies on.

## License

MIT
