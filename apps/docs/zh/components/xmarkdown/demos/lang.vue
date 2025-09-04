<docs>
---
title: 内置一些代码块语言的匹配
---

我们内置了一些常用的编程、开发语言的匹配，用于渲染对应的代码块内容。

:::warning
其中一些语言我们可以去匹配他的简写，比如 `javascript` 可以使用 `js` 去匹配
:::

::: details 💝 查看所有语言的支持
| 语言名称 | 语言匹配ID | 语言匹配简写 |
| --- | --- | --- |
| ABAP | abap |  |
| ActionScript | actionscript-3 |  |
| Ada | ada |  |
| Angular HTML | angular-html |  |
| Angular TypeScript | angular-ts |  |
| Apache Conf | apache |  |
| Apex | apex |  |
| APL | apl |  |
| AppleScript | applescript |  |
| Ara | ara |  |
| AsciiDoc | asciidoc | adoc |
| Assembly | asm |  |
| Astro | astro |  |
| AWK | awk |  |
| Ballerina | ballerina |  |
| Batch File | bat | batch |
| Beancount | beancount |  |
| Berry | berry | be |
| BibTeX | bibtex |  |
| Bicep | bicep |  |
| Blade | blade |  |
| 1C (Enterprise) | bsl | 1c |
| C | c |  |
| Cadence | cadence | cdc |
| Cairo | cairo |  |
| Clarity | clarity |  |
| Clojure | clojure | clj |
| CMake | cmake |  |
| COBOL | cobol |  |
| CODEOWNERS | codeowners |  |
| CodeQL | codeql | ql |
| CoffeeScript | coffee | coffeescript |
| Common Lisp | common-lisp | lisp |
| Coq | coq |  |
| C++ | cpp | c++ |
| Crystal | crystal |  |
| C# | csharp | c#cs |
| CSS | css |  |
| CSV | csv |  |
| CUE | cue |  |
| Cypher | cypher | cql |
| D | d |  |
| Dart | dart |  |
| DAX | dax |  |
| Desktop | desktop |  |
| Diff | diff |  |
| Dockerfile | docker | dockerfile |
| dotEnv | dotenv |  |
| Dream Maker | dream-maker |  |
| Edge | edge |  |
| Elixir | elixir |  |
| Elm | elm |  |
| Emacs Lisp | emacs-lisp | elisp |
| ERB | erb |  |
| Erlang | erlang | erl |
| Fennel | fennel |  |
| Fish | fish |  |
| Fluent | fluent | ftl |
| Fortran (Fixed Form) | fortran-fixed-form | fforf77 |
| Fortran (Free Form) | fortran-free-form | f90f95f03f08f18 |
| F# | fsharp | f#fs |
| GDResource | gdresource |  |
| GDScript | gdscript |  |
| GDShader | gdshader |  |
| Genie | genie |  |
| Gherkin | gherkin |  |
| Git Commit Message | git-commit |  |
| Git Rebase Message | git-rebase |  |
| Gleam | gleam |  |
| Glimmer JS | glimmer-js | gjs |
| Glimmer TS | glimmer-ts | gts |
| GLSL | glsl |  |
| Gnuplot | gnuplot |  |
| Go | go |  |
| GraphQL | graphql | gql |
| Groovy | groovy |  |
| Hack | hack |  |
| Ruby Haml | haml |  |
| Handlebars | handlebars | hbs |
| Haskell | haskell | hs |
| Haxe | haxe |  |
| HashiCorp HCL | hcl |  |
| Hjson | hjson |  |
| HLSL | hlsl |  |
| HTML | html |  |
| HTML (Derivative) | html-derivative |  |
| HTTP | http |  |
| HXML | hxml |  |
| Hy | hy |  |
| Imba | imba |  |
| INI | ini | properties |
| Java | java |  |
| JavaScript | javascript | js |
| Jinja | jinja |  |
| Jison | jison |  |
| JSON | json |  |
| JSON5 | json5 |  |
| JSON with Comments | jsonc |  |
| JSON Lines | jsonl |  |
| Jsonnet | jsonnet |  |
| JSSM | jssm | fsl |
| JSX | jsx |  |
| Julia | julia | jl |
| Kotlin | kotlin | ktkts |
| Kusto | kusto | kql |
| LaTeX | latex |  |
| Lean 4 | lean | lean4 |
| Less | less |  |
| Liquid | liquid |  |
| LLVM IR | llvm |  |
| Log file | log |  |
| Logo | logo |  |
| Lua | lua |  |
| Luau | luau |  |
| Makefile | make | makefile |
| Markdown | markdown | md |
| Marko | marko |  |
| MATLAB | matlab |  |
| MDC | mdc |  |
| MDX | mdx |  |
| Mermaid | mermaid | mmd |
| MIPS Assembly | mipsasm | mips |
| Mojo | mojo |  |
| Move | move |  |
| Narrat Language | narrat | nar |
| Nextflow | nextflow | nf |
| Nginx | nginx |  |
| Nim | nim |  |
| Nix | nix |  |
| nushell | nushell | nu |
| Objective-C | objective-c | objc |
| Objective-C++ | objective-cpp |  |
| OCaml | ocaml |  |
| Pascal | pascal |  |
| Perl | perl |  |
| PHP | php |  |
| PL/SQL | plsql |  |
| Gettext PO | po | potpotx |
| Polar | polar |  |
| PostCSS | postcss |  |
| PowerQuery | powerquery |  |
| PowerShell | powershell | psps1 |
| Prisma | prisma |  |
| Prolog | prolog |  |
| Protocol Buffer 3 | proto | protobuf |
| Pug | pug | jade |
| Puppet | puppet |  |
| PureScript | purescript |  |
| Python | python | py |
| QML | qml |  |
| QML Directory | qmldir |  |
| Qt Style Sheets | qss |  |
| R | r |  |
| Racket | racket |  |
| Raku | raku | perl6 |
| ASP.NET Razor | razor |  |
| Windows Registry Script | reg |  |
| RegExp | regexp | regex |
| Rel | rel |  |
| RISC-V | riscv |  |
| reStructuredText | rst |  |
| Ruby | ruby | rb |
| Rust | rust | rs |
| SAS | sas |  |
| Sass | sass |  |
| Scala | scala |  |
| Scheme | scheme |  |
| SCSS | scss |  |
| 1C (Query) | sdbl | 1c-query |
| ShaderLab | shaderlab | shader |
| Shell | shellscript | bashshshellzsh |
| Shell Session | shellsession | console |
| Smalltalk | smalltalk |  |
| Solidity | solidity |  |
| Closure Templates | soy | closure-templates |
| SPARQL | sparql |  |
| Splunk Query Language | splunk | spl |
| SQL | sql |  |
| SSH Config | ssh-config |  |
| Stata | stata |  |
| Stylus | stylus | styl |
| Svelte | svelte |  |
| Swift | swift |  |
| SystemVerilog | system-verilog |  |
| Systemd Units | systemd |  |
| TalonScript | talonscript | talon |
| Tasl | tasl |  |
| Tcl | tcl |  |
| Templ | templ |  |
| Terraform | terraform | tftfvars |
| TeX | tex |  |
| TOML | toml |  |
| TypeScript with Tags | ts-tags | lit |
| TSV | tsv |  |
| TSX | tsx |  |
| Turtle | turtle |  |
| Twig | twig |  |
| TypeScript | typescript | ts |
| TypeSpec | typespec | tsp |
| Typst | typst | typ |
| V | v |  |
| Vala | vala |  |
| Visual Basic | vb | cmd |
| Verilog | verilog |  |
| VHDL | vhdl |  |
| Vim Script | viml | vimvimscript |
| Vue | vue |  |
| Vue HTML | vue-html |  |
| Vyper | vyper | vy |
| WebAssembly | wasm |  |
| Wenyan | wenyan | 文言 |
| WGSL | wgsl |  |
| Wikitext | wikitext | mediawikiwiki |
| WebAssembly Interface Types | wit |  |
| Wolfram | wolfram | wl |
| XML | xml |  |
| XSL | xsl |  |
| YAML | yaml | yml |
| ZenScript | zenscript |  |
| Zig | zig |  |
:::
</docs>

<script setup lang="ts">
const markdown = `
\`\`\`js
console.log('hello world');
\`\`\`

\`\`\`ts
import 'self-markdown.css'
\`\`\`
`;
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <XMarkdown :markdown="markdown" allowHtml>
      <template #img="{ ...props }">
        <img :key="props.key" :src="props.src" style="border-radius: 30px">
      </template>

      <template #self-btn="{ ...props }">
        <el-button :key="props.key">
          控制台查看 props 打印{{ console.log(props) }}
        </el-button>
      </template>
    </XMarkdown>
  </div>
</template>

<style scoped lang="less"></style>
