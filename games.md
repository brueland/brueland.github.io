---
layout: default
title: Portfolio
permalink: /games/
body_class: deck-page
---

<div class="deck-intro">
  <p class="deck-intro-eyebrow">Wesley Brueland // ML Engineer &amp; Game Developer</p>
  <h1>The Deck</h1>
  {% assign here = site.data.projects | where: 'playable_here', true %}
  <p class="deck-intro-lede">
    Every project I have shipped, stacked into one pile. Scroll to flick
    through the deck, then click the card facing you to open it.
    A number of them run straight in your browser, hosted here on
    brue.land using WebGL; the rest live on itch.io.
  </p>
</div>

{% include deck.html %}

<div class="deck-outro">

  {% include reviews.html %}

  <h2>Skills &amp; Tools</h2>

  <div class="px-grid">
    <div class="px-tile">
      <h3>Engines</h3>
      <p>Unity, Godot</p>
    </div>
    <div class="px-tile">
      <h3>Languages</h3>
      <p>C#, GDScript, GLSL, Python</p>
    </div>
    <div class="px-tile">
      <h3>Tech</h3>
      <p>OpenGL, Git, WebGL builds, AI/ML integration, procedural generation</p>
    </div>
    <div class="px-tile">
      <h3>Craft</h3>
      <p>Gameplay programming, game design and polish, rapid jam prototyping</p>
    </div>
  </div>

  <h2>Awards &amp; Recognition</h2>

  <ul class="px-list">
    <li><strong>Excellence Award</strong> &mdash; Playful.AI Game Jam, for <em>Galactic Marbles</em></li>
    <li><strong>P1 Ignite Jam Winner</strong> &mdash; Best Theme Fit, Best Art, Most Accessible, Emotional Masterpiece, and Best Narrative, for <em>Blue Rust</em></li>
    <li><strong>Score Space Jam #32</strong> &mdash; Top 30 of 71, for <em>Reel Legends</em></li>
  </ul>

  <h2>Find Me</h2>

  <div class="deck-panel-links">
    <a class="pixel-btn" href="https://brueland.itch.io">itch.io &#9656;</a>
    <a class="pixel-btn is-ghost" href="https://github.com/brueland">GitHub &#9656;</a>
    <a class="pixel-btn is-ghost" href="https://www.linkedin.com/in/wesleybrueland">LinkedIn &#9656;</a>
    <a class="pixel-btn is-ghost" href="mailto:wesbrueland@gmail.com">Email &#9656;</a>
  </div>

</div>
