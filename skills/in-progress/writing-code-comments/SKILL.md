---
name: writing-code-comments
description: 'Code comments — always use when writing or editing code, and when addressing review feedback about clarity.'
---

# Writing code comments

A comment carries what the designer knew but the code can't say: the reason behind a choice, the constraint that forces it, the meaning a caller relies on. The _first-time reader_ decides what is _obvious_. When you review someone else's code, you are that reader. When you write code, you carry the _curse of knowledge_: what you read to write it now looks obvious to you. The checks below are how you see your code as that reader does.

## Steps

Run these for every comment the change adds or edits.

1. **Pick the kind.**
   - An _interface_ comment sits on a declaration and gives a caller what they need to use it: what a value means, its units and bounds, what an empty or missing value means, side effects, ordering, how it interacts with its neighbours. It speaks from the caller's side; how the inside works stays out.
   - An _implementation_ comment sits inside the code and gives the next maintainer the reason it is this way.
2. **Run the _obvious_ test.** Could the comment be written from the code beside it alone? If yes, the comment adds nothing yet. Fix it in this order:
   - _Better code_ — when the comment is doing a name's job, rename or extract, and the comment goes.
   - _Rewrite_ — replace the restatement with what the code can't show. Describe the thing in words other than its own name; its name is already on the page.
   - _Delete_ — when everything worth saying is already in the code.
3. **Check the level.** A comment that passes adds _precision_ or _intuition_:
   - _Precision_ — the level below the code: exact meaning, units, range, the edge case. For a variable or field, say what it represents, not how the code moves it around.
   - _Intuition_ — the level above the code: the reason, the intent, a simpler way to think about it.
4. **_Prune_ it.**
   - Lead with the reason; the consequence follows.
   - Keep a sentence only if a maintainer changing this line would get it wrong without it; everything else is a _tangent_, however true.
   - State the reason in the comment itself. When a decision record kept in the repo covers it at length, add a pointer to it as well — the pointer adds depth, the comment stands alone.
   - Cut every word that does no work.
   - One thought per sentence. Split the sentence that carries two; keep the long sentence that carries one.
   - Specific over sterile: name the concrete consequence — "a renamed column fails the build".
   - Literal words that mean what they say.

## Interface gate

A declaration the change adds or changes gets an _interface_ comment, in the language's doc-comment syntax, exactly when a caller outside the module can't use it correctly from its name and type alone. When name and type suffice, the declaration stays bare.

## Missing reasons

Before handing in, ask where you learned each thing the code depends on. Anything that reached you from outside this code — the task, the design, docs you read, approaches that failed — is invisible to the next reader; give it an _implementation_ comment.

## Comments beside changed code

An existing comment next to the code you changed may hold context you lack, so its wording is its author's call. Check only that it is still true: when your edit changed a value, a branch, or a reason it states, correct it.

## Review feedback

When a reviewer finds something unclear, they are the _first-time reader_, so they are right. Find what confused them and answer it in the code — a clearer comment or clearer code — then point your reply at that change. The next reader gets only the code, never the thread.

## Done when

- Every comment the change adds or edits passes the _obvious_ test, adds _precision_ or _intuition_, and survives _pruning_ sentence by sentence.
- Every reason that reached you from outside the code sits in a comment.
- Every comment beside changed code is still true.
- Every declaration the change adds or changes that the _interface gate_ calls for carries an _interface_ comment.