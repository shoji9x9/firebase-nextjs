import { messageAtom } from "@/states/messageAtom";
import { LoginUser } from "@/states/userAtom";
import { techStacks } from "@/types/techStacks";
import { Career, CareerSchema, TechStack } from "@/types/types";
import { exceptionMessage, successMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Theme,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactNode, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { saveCareer } from "@/services/saveCareer";

export function CareerForm({
  career,
  loginUser,
}: {
  career: Career;
  loginUser?: LoginUser;
}) {
  const setMessageAtom = useSetRecoilState(messageAtom);

  console.log("CareerForm: ", career);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    control,
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<Career>({
    // modeをonSubmitにすることで、Saveボタンを押すまではフォーカスアウトのタイミングではバリデーションは動かないようになる
    mode: "onSubmit",
    // reValidateModeをonBlurにすることで、Saveボタンが押された後はフォーカスアウトのタイミングでバリデーションが走る
    reValidateMode: "onBlur",
    // careerは非同期に親コンポーネントから渡される
    defaultValues: career,
    // zodResolverの引数にvalidation時に実行するschemaを渡す
    resolver: zodResolver(CareerSchema),
  });

  const onSubmit: SubmitHandler<Career> = async (data) => {
    try {
      await saveCareer(data, loginUser);
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...successMessage("Saved"),
        };
      });
      // TODO: dirtyでないようにする。現状、Saveボタン押下してもdirtyのままになってしまっている
    } catch (error) {
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...exceptionMessage(),
        };
      });
    }
  };

  const onDelete: SubmitHandler<Career> = async (data) => {
    try {
      // TODO: 別途実装
      console.log("onDelete: ", data);
    } catch (error) {
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...exceptionMessage(),
        };
      });
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  };

  const theme = useTheme();

  function getStyles(
    name: string,
    techStacks: readonly TechStack[],
    theme: Theme
  ) {
    return {
      fontWeight:
        techStacks.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const isEditingsWatch = watch("isEditing");
  useEffect(() => {
    console.log(isEditingsWatch);
  }, [isEditingsWatch]);

  return (
    <Box className="w-2/3">
      <Stack spacing={2}>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid item>
            <IconButton
              aria-label="edit"
              name={register("isEditing").name}
              ref={register("isEditing").ref}
              onClick={() => {
                setValue("isEditing", true);
              }}
              disabled={!!watch("isEditing")}
            >
              <ModeEditIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="delete"
              // TODO: データ登録済の場合のみdisabledを解除する
              disabled={!!watch("isEditing")}
              onClick={handleSubmit(onDelete)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        <TextField
          variant="outlined"
          label="Project name"
          required
          {...register("projectName")}
          error={!!errors.projectName}
          helperText={errors.projectName?.message as ReactNode}
          disabled={!watch("isEditing")}
        />
        <Grid container columnSpacing={2} alignItems="center">
          <Grid item xs={3.5} sx={{ paddingLeft: "0 !important" }}>
            <FormControlLabel
              control={
                <Switch
                  {...register("isPresent")}
                  checked={watch("isPresent")}
                  disabled={!watch("isEditing") || !!watch("endYearMonth")}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Present job"
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="startYearMonth"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Start date"
                  slotProps={{
                    textField: {
                      required: true,
                      error: !!errors.startYearMonth,
                      helperText: errors.startYearMonth?.message as ReactNode,
                    },
                    // TODO: クリアー時にvalueがMMMM YYYYとなって気持ち悪いのでonClear()の実装を検討
                    // https://mui.com/x/react-date-pickers/date-picker/#clearing-the-value
                    field: { clearable: true },
                  }}
                  onChange={(value) => {
                    const _value = value === null ? "" : value;
                    field.onChange(_value);
                    field.onBlur();
                  }}
                  views={["month", "year"]}
                  disabled={!watch("isEditing")}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              name="endYearMonth"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="End date"
                  slotProps={{
                    textField: {
                      error: !!errors.endYearMonth,
                      helperText: errors.endYearMonth?.message as ReactNode,
                    },
                    field: { clearable: true },
                  }}
                  onChange={(value) => {
                    const _value = value === null ? "" : value;
                    field.onChange(_value);
                    field.onBlur();
                  }}
                  views={["month", "year"]}
                  disabled={!watch("isEditing") || watch("isPresent")}
                />
              )}
            />
          </Grid>
        </Grid>
        <FormControl>
          <InputLabel id="tech-stack-label">Tech stack</InputLabel>
          <Select
            {...register("techStack")}
            value={watch("techStack") || []}
            labelId="tech-stack-label"
            multiple
            input={
              <OutlinedInput id="select-multiple-chip" label="Tech stack" />
            }
            renderValue={(selected: TechStack[]) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            disabled={!watch("isEditing")}
          >
            {techStacks.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, watch("techStack") || [], theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="Summary"
          {...register("summary")}
          error={!!errors.summary}
          helperText={errors.summary?.message as ReactNode}
          multiline
          rows={5}
          disabled={!watch("isEditing")}
        />
        <TextField
          type="number"
          variant="outlined"
          label="Team size"
          {...register("teamSize")}
          error={!!errors.teamSize}
          helperText={errors.teamSize?.message as ReactNode}
          disabled={!watch("isEditing")}
        />
        <Box>
          <Button
            variant="outlined"
            disabled={!watch("isEditing")}
            onClick={() => setValue("isEditing", false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="ml-2"
            onClick={handleSubmit(onSubmit)}
            disabled={!watch("isEditing")}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
