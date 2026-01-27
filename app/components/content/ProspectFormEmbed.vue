<script setup lang="ts">
const props = defineProps<{
  formId: string
}>()

useScript({
  src: `https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa+nPox7g%252Fhhu4C+wDua6PEgA==/${props.formId}/form.js`
})

const route = useRoute()
const toast = useToast()

if (route.query.message === 'form-received') {
  toast.add({
    title: 'Thank you',
    description: 'We received your message and will be in touch shortly.',
    color: 'success',
    duration: 5000
  })
}
</script>

<template>
  <div>
    <div :id="`prospect-form-${formId}`">
      <div
        class="prospect-form-loading"
        style="width:50px;height:50px;margin:0 auto;background:url(https://userresources.prospect365.com/forms/spinner.svg)
      center
      center
      no-repeat;background-size:contain"
      />
    </div>
    <!-- <div id="prospect-form-8" style="all: initial">
      <form
        id="prospect-form-8-embed"
        class="prospect-form"
        action="https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fa%2BnPox7g%252Fhhu4C%2BwDua6PEgA%3D%3D/8/submit"
        method="POST"
        style="grid-template-columns: auto 1fr;"
      >
        <h2 id="control-1383877" field-mapping="Custom" column="span 1">
          Contact Us
        </h2><label for="text-1660649455927-0" class="prospect-form-text-label">Name
          <span class="prospect-form-required">*</span>
        </label>
        <input
          id="text-1660649455927-0"
          type="text"
          class="form-control"
          name="text-1660649455927-0"
          field-mapping="Forename"
          column="span 1"
          required="required"
          aria-required="true"
          style="grid-column-end: span 1;"
        ><label for="text-1660649457896-0" class="prospect-form-text-label">Email
          <span class="prospect-form-required">*</span>
        </label>
        <input
          id="text-1660649457896-0"
          type="email"
          class="form-control"
          name="text-1660649457896-0"
          field-mapping="Email"
          column="span 1"
          required="required"
          aria-required="true"
          style="grid-column-end: span 1;"
        ><label for="text-1660649458928-0" class="prospect-form-text-label">Company Name
          <span class="prospect-form-required">*</span>
        </label>
        <input
          id="text-1660649458928-0"
          type="text"
          class="form-control"
          name="text-1660649458928-0"
          field-mapping="CompanyName"
          column="span 1"
          required="required"
          aria-required="true"
          style="grid-column-end: span 1;"
        ><label for="text-1759492379925-0" class="prospect-form-text-label">Your Machine
          <span class="tooltip-element" tooltip="What machine do you currently have, or require help with?">?</span>
        </label>
        <input
          id="text-1759492379925-0"
          type="text"
          placeholder="eg: STOB, KL-BV, Variocut"
          class="form-control"
          name="text-1759492379925-0"
          field-mapping="Custom"
          column="span 1"
          title="What machine do you currently have, or require help with?"
          style="grid-column-end: span 1;"
        ><label for="text-1759492307230-0" class="prospect-form-text-label">Message
          <span class="tooltip-element" tooltip="Please let us know some more information on your requirement. ">?</span>
        </label>
        <input
          id="text-1759492307230-0"
          type="text"
          placeholder="Please let us know more about your requirement. eg, Spare Parts Required?"
          class="form-control"
          name="text-1759492307230-0"
          field-mapping="Custom"
          column="span 5"
          title="Please let us know some more information on your requirement. "
          style="grid-column-end: span 5;"
        ><button class="prospect-form-submit" type="submit">
          Submit
        </button>
        <input name="prospect-form-8-url" type="hidden" value="https://metzner.netlify.app/spares">
      </form>
    </div> -->
  </div>
</template>

<style scoped>
  .prospect-form {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  }

  .prospect-form, input, select, textarea {
  font-family: Helvetica, Arial, Verdana, sans-serif;
  font-size: 0.9em;
  color: rgba(0,0,0,0.87);
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  button,
  .checkbox-group {
  grid-column: 1 / -1;
  }

  .prospect-form-error {
  color: red;
  justify-self: center;
  }

  .prospect-form-submit {
  justify-self: center;
  }

  .prospect-form-radio label, .prospect-form-checkbox label {
  font-weight: normal;
  }

  label {
  margin-right: 15px;
  font-weight: bold;
  }

  label + * {
  margin-top: 5px;
  margin-bottom: 5px;
  }

  .prospect-form-required {
  color: red;
  margin-left: 2px;
  }

  input, textarea, button, select {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: inset 0 1px 1px #00000013;
  padding: 6px 10px;
  }

  textarea:focus, input:focus {
  outline: none !important;
  border: 1px solid #045980;
  }

  .tooltip-element {
  color: #fff;
  background: #000;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  display: inline-block;
  text-align: center;
  line-height: 8px;
  margin: 0 5px;
  font-size: 12px;
  position: relative;
  padding: 4px;
  }

  [tooltip]:before {
  content: attr(tooltip);
  display: none;
  position: absolute;
  background: #000;
  color: #fff;
  padding: 4px 8px;
  font-size: 14px;
  line-height: 1.4;
  min-width: 100px;
  text-align: center;
  border-radius: 4px;
  top: 50%;
  -ms-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 100%;
  margin-left: 6px;
  }

  .tooltip-element:after {
  content: "";
  display: none;
  position: absolute;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  top: 50%;
  margin-top: -6px;
  left: 100%;
  border-width: 6px 6px 6px 0;
  border-right-color: #000;
  }

  .tooltip-element:hover:before,
  .tooltip-element:hover:after {
  display: block;
  z-index: 50;
  }
</style>
