<script lang="ts">
  import type { JSONSchema7Definition } from "json-schema";
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';
  import AnyOfControl from "./AnyOfControl.svelte";
  import ObjectProps from "./ObjectProps.svelte";

  export let data: { [prop: string]: any };
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let properties: { [prop: string]: any } | undefined = undefined;
  export let required: string[] = [];
  export let anyOf: JSONSchema7Definition[] | undefined = undefined;

  let open = true;
  let hasProps = false;

  $: if (data == null) {
    data = {};
  }
  $: justAnyOf = (title == null) && (properties == null) && (anyOf != null);
  $: hasProps = !!Object.keys(properties ?? {}).length || !!Object.keys(anyOf ?? {}).length;
</script>

{#if hasProps}
  {#if justAnyOf}
    <AnyOfControl {anyOf} type={'object'} bind:data={data} />
  {:else}
    <Accordion class="jsonschema-form-control control-object">
      <Panel bind:open variant="unelevated">
        <slot name="title" {title}>
          <Header>
            {title ?? ""}
            <span slot="description">{description ?? ""}</span>
            <IconButton slot="icon" toggle pressed={open}>
              <Icon class="material-icons" on>expand_less</Icon>
              <Icon class="material-icons">expand_more</Icon>
            </IconButton>
          </Header>
        </slot>
        <Content class="jsonschema-form-controls">
          <ObjectProps {properties} {required} {anyOf} bind:data />
        </Content>
      </Panel>
    </Accordion>
  {/if}
{/if}
